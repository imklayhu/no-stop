# NoStop (不停车) - 技术架构设计文档

## 1. 架构概览

NoStop 采用 **Monorepo** 结构，前后端分离，核心特色是引入 **MCP (Model Context Protocol) Server** 作为连接 LLM 与地图服务的桥梁，实现智能化路线生成。

```mermaid
graph TD
    User[用户终端 (Web/Mobile)] --> FE[前端应用 (React + Vite)]
    FE --> API_GW[API 网关 (Nginx/Ingress)]
    API_GW --> BE[后端服务 (NestJS)]
    
    subgraph "后端核心层 (NestJS)"
        BE --> Controller[RouteController]
        Controller --> Service[RouteService]
        Service --> Algo[评分算法引擎]
        Service --> MCP_Client[MCP Client 模块]
    end
    
    subgraph "智能与地图服务层"
        MCP_Client --> MCP_Server[高德 MCP Server]
        MCP_Client --> LLM[LLM 服务 (OpenAI/DeepSeek)]
        MCP_Server --> AMap_API[高德地图开放平台]
    end
    
    subgraph "数据存储层"
        BE --> DB[(Supabase / PostgreSQL)]
    end
```

## 2. 技术栈详细说明

| 模块 | 技术选型 | 理由 |
| :--- | :--- | :--- |
| **Monorepo** | pnpm workspaces | 统一管理前后端代码，共享类型定义 (`packages/shared`) |
| **前端** | React 18 + Vite + TailwindCSS | 现代、高效、响应式，易于扩展 |
| **后端** | NestJS (Node.js) | 结构化强，模块化，TypeScript 原生支持，适合复杂逻辑 |
| **数据库** | Supabase (PostgreSQL) | 强大的关系型数据库，支持 PostGIS 地理信息扩展 |
| **地图服务** | **百度地图 (Baidu Map)** | 高德注册受限暂用百度。支持 Web 服务 API（路径规划/搜索）和 JS API。 |
| **MCP** | MCP SDK | 标准化 LLM 调用工具的方式，解耦 LLM 与具体地图 API |
| **LLM** | OpenAI / DeepSeek | 用于意图理解和生成自然语言路书点评 |

## 3. 核心模块设计

### 3.1 评分算法引擎 (Scoring Engine)
这不是一个 AI 黑盒，而是一套**确定性算法**。
*   **输入**：百度地图返回的原始路线数据 (GeoJSON / Steps)。
*   **处理**：
    1.  **红绿灯提取**：遍历路线 step，统计 `traffic_lights` 数量。
    2.  **转弯分析**：计算相邻 step 的角度差，识别 > 160° 的掉头弯 (U-turn) 和 < 45° 的急弯。
    3.  **连续性计算**：寻找最长的一段无红绿灯、无急弯的距离。
*   **输出**：`Score` (0-100) 及各项细分指标。

### 3.2 LLM 交互与 Prompt 设计 (Intent Parsing & Guide Generation)
LLM 主要负责意图理解和最终文案生成，不直接参与路径计算。

#### 意图解析 Prompt 示例
```text
System: You are a cycling route assistant. Extract cycling intent from user input. Return strict JSON.
Input: "我想在家附近绕圈骑 30 公里，别老停"
Output: 
{
  "mode": "urban_loop",
  "distance_km": 30,
  "stop_tolerance": "very_low",
  "u_turn_allowed": false,
  "priority": ["continuity", "safety"]
}
```

#### 路书生成 Prompt 示例
```text
System: Based on the route metrics (30km, 2 traffic lights, 12km straight section), write a brief cycling guide.
Input: { distance: 30, lights: 2, max_continuous_dist: 12 }
Output: "这条路线全长 30km，路况极佳，仅有 2 个红绿灯。其中有一段长达 12km 的无干扰直路，非常适合进行功率训练。"
```

### 3.3 MCP Server 集成
我们不直接在后端写死百度 API 调用，而是封装一个 MCP Server。
*   **Tool: `generate_cycling_route`**
    *   参数：`origin` (起点), `destination` (终点), `distance` (可选约束)
    *   功能：调用百度骑行路径规划接口。
*   **Tool: `search_poi`**
    *   参数：`keyword`, `radius`, `center`
    *   功能：查询沿途补给点。
*   **LLM 交互模式**：
    后端 -> LLM: "用户想在上海徐汇滨江骑 30km，请帮我规划。"
    LLM -> MCP: 调用 `generate_cycling_route` (自动拆解起终点和中间途经点以凑够距离)。
    MCP -> LLM: 返回路线数据。
    LLM -> 后端: 返回结构化数据或路书文案。

## 4. 数据模型设计 (Database Schema)

基于 Supabase (PostgreSQL)，核心表结构如下：

### 4.1 Users (用户表)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | UUID | 主键 |
| phone | VARCHAR | 手机号 (MVP可选) |
| created_at | TIMESTAMP | |

### 4.2 Routes (路线表)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | UUID | 主键 |
| user_id | UUID | 关联用户 |
| **meta_data** | JSONB | 核心指标：`{ distance: 30.5, traffic_lights: 4, u_turns: 0, score: 95 }` |
| **path_data** | JSONB | 百度原始路径数据 (GeoJSON)，用于前端绘制 |
| **guide_text** | TEXT | LLM 生成的路书点评 |
| created_at | TIMESTAMP | |

### 4.3 RouteSegments (路段表 - 可选，用于精细化分析)
用于存储路线中的关键分段（如“滨江冲刺段”），便于后续分析。

## 5. API 接口定义

### 5.1 生成路线 (异步/同步视性能而定)
`POST /api/routes/generate`
*   **Request**:
    ```json
    {
      "origin": "121.47,31.23",
      "targetDistance": 30, // km
      "type": "loop"
    }
    ```
*   **Response**:
    ```json
    {
      "routes": [
        {
          "id": "temp-uuid-1",
          "score": 98,
          "metrics": { "lights": 2, "u_turns": 0 },
          "guide": "这条路线...",
          "geoJson": { ... }
        }
      ]
    }
    ```

### 5.2 导出 GPX
`GET /api/routes/:id/export`
*   **Response**: 文件流 (`application/gpx+xml`)

## 6. MVP 阶段的取舍
*   **暂不引入 PostGIS**：MVP 阶段直接存 GeoJSON 字符串，前端负责渲染，后端负责基于 JSON 结构的简单计算，降低数据库运维成本。
*   **缓存策略**：对于热门起点（如知名公园、地标），可以缓存高分路线，减少 API 调用成本。
