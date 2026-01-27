# NoStop - 技术架构文档

## 1. 系统架构概览

本系统采用轻量级前后端分离架构，核心依赖于地图服务 API 和 LLM 服务。

```mermaid
graph TD
    User[用户 (Mobile App/Web)] -->|HTTPS| API_Gateway[API 网关]
    
    subgraph Frontend
        Mobile[移动端 PWA/Native]
        Web[Web 端]
    end
    
    subgraph Backend_Services
        API_Gateway --> Intent_Service[意图解析服务]
        API_Gateway --> Route_Service[路线生成服务]
        API_Gateway --> Scorer_Service[路线评分服务]
        API_Gateway --> Guide_Service[路书生成服务]
    end
    
    subgraph External_Services
        LLM[LLM Provider (OpenAI/Anthropic)]
        Map[Map Provider (Mapbox/Google/Amap)]
    end
    
    subgraph Data_Layer
        DB[(PostgreSQL + PostGIS)]
        Cache[(Redis)]
    end

    Intent_Service --> LLM
    Route_Service --> Map
    Route_Service --> DB
    Scorer_Service --> Map
    Guide_Service --> LLM
```

## 2. 技术栈选型

### 2.1 前端 (Frontend)
*   **框架**: React (Next.js) - 兼顾 SEO 和 SPA 体验，便于快速构建 PWA。
*   **UI 库**: Tailwind CSS - 快速构建自定义 UI，无冗余样式。
*   **地图组件**: Mapbox GL JS 或 Leaflet - 高性能矢量地图渲染。
*   **状态管理**: Zustand 或 React Context - 轻量级状态管理。

### 2.2 后端 (Backend)
*   **Runtime**: Node.js (TypeScript) 或 Python (FastAPI)。
    *   *推荐 Python*：便于处理地理空间算法 (Shapely, GeoPandas, NetworkX)。
*   **框架**: FastAPI (Python) - 高性能，原生支持异步，适合 I/O 密集型任务。
*   **API 规范**: RESTful API / OpenAPI。

### 2.3 数据存储 (Storage)
*   **数据库**: PostgreSQL + **PostGIS** 插件。
    *   核心能力：存储地理空间数据，执行空间查询（如“查找起点半径 5km 内的适合道路”）。
*   **缓存**: Redis (可选，用于缓存热门区域的路线计算结果)。

### 2.4 AI & 地图服务
*   **LLM**: OpenAI GPT-4o-mini 或 Claude 3 Haiku (注重响应速度和成本)。
    *   用途：意图解析、路书文案生成。
*   **地图数据**: 
    *   **Mapbox API**: 基础底图、路径规划 (Directions API)、地图匹配 (Map Matching)。
    *   **OpenStreetMap (OSM)**: 原始路网数据源，用于提取道路属性（如是否为内部路、车道数）。

## 3. 核心模块设计

### 3.1 意图解析模块
*   **输入**: 用户自然语言文本。
*   **处理**: Prompt Engineering，要求 LLM 输出严格 JSON 格式。
*   **Prompt 示例**:
    > "Extract cycling intent from user input. Return JSON with fields: mode, distance_km, constraints."

### 3.2 路线生成模块 (核心算法)
此模块不依赖纯 LLM 生成路线（因为 LLM 容易产生幻觉），而是采用**“算法生成 + LLM 解释”**的模式。

1.  **路网构建**: 基于 OSM 数据，构建带权重的有向图。
    *   权重因子：距离、道路等级（主干道权重极高以避免）、红绿灯密度（预处理数据）。
2.  **闭环生成算法**:
    *   以起点为中心，生成多个方位的中途点 (Waypoints)。
    *   使用路径规划算法 (如 A* 或 Dijkstra) 连接：起点 -> 中途点1 -> ... -> 起点。
    *   加入随机扰动因子，生成多样化路线。
3.  **约束过滤**: 剔除长度误差 > 10% 或包含禁行路段的路线。

### 3.3 评分与筛选模块
对候选路线进行几何分析：
*   **红绿灯检测**: 将路线坐标与红绿灯 POI 数据库比对。
*   **转弯分析**: 计算路径各节点的航向角变化，识别 > 120° 的急转弯 (U-turn)。
*   **连续性计算**: 识别无路口/无红绿灯的长直路段。

### 3.4 路书生成模块
*   **输入**: 优选路线的 GeoJSON 数据 + 评分元数据。
*   **处理**: 将结构化数据输入 LLM。
*   **Prompt 示例**:
    > "Based on this route data (6km, 4 traffic lights, mostly flat), write a brief, encouraging guide for a cyclist. Mention the 2km straight section."

## 4. 数据模型 (简化版)

### 4.1 Users (用户)
*   `id`: UUID
*   `created_at`: Timestamp
*   `preferences`: JSON (默认训练偏好)

### 4.2 Routes (路线)
*   `id`: UUID
*   `user_id`: UUID (Creator)
*   `name`: String
*   `geometry`: LineString (PostGIS)
*   `distance`: Float
*   `metrics`: JSON (红绿灯数, 转弯数等)
*   `description`: Text (LLM 生成的路书)
*   `is_public`: Boolean

## 5. 接口设计 (API)

*   `POST /api/v1/intent/parse` - 解析用户输入
*   `POST /api/v1/routes/generate` - 触发路线生成任务 (异步)
*   `GET /api/v1/routes/{task_id}/status` - 轮询生成进度
*   `GET /api/v1/routes/{route_id}/gpx` - 下载 GPX 文件

## 6. 开发路线图 (Roadmap)
1.  **Phase 1**: 搭建基础地图展示，实现基于固定规则的路线生成。
2.  **Phase 2**: 接入 LLM 实现意图解析和路书文案。
3.  **Phase 3**: 优化评分算法，引入红绿灯数据源。
4.  **Phase 4**: 完善 GPX 导出和移动端适配。
