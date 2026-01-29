# NoStop (不停车) - 技术选型方案

基于 Monorepo 架构与 MVP 快速落地目标，以下为详细的技术选型方案。

## 1. 核心技术栈概览

| 模块 | 技术框架/服务 | 选型理由 |
| :--- | :--- | :--- |
| **包管理** | **pnpm** | 高效的 monorepo 支持，节省磁盘空间，安装速度快。 |
| **前端** | **React 18 + Vite** | 生态成熟，开发体验好，性能优异。 |
| **后端** | **NestJS** | 模块化架构，完美支持 TypeScript，易于封装算法与 MCP 服务。 |
| **数据库** | **Supabase (PostgreSQL)** | 开箱即用的 PG 数据库，自带 REST API 和 Auth，极大降低运维成本。 |
| **ORM** | **Prisma** | 类型安全的 ORM，与 NestJS 和 TypeScript 配合极佳，支持自动生成迁移。 |
| **地图服务** | **百度地图 (Baidu Map)** | 高德注册受限暂用百度。支持 Web 服务 API（路径规划/搜索）和 JS API。 |
| **LLM** | **MiniMax (MiniMax-M2)** | 专为 Agent 和 Tool Use 优化的模型，支持 Function Calling，性价比极高，完美契合本项目的 MCP 架构与意图解析需求。 |

## 2. 详细选型说明

### 2.1 前端 (apps/web)
*   **基础框架**: React 18, TypeScript, Vite
*   **UI 库**:
    *   **TailwindCSS**: 原子化 CSS，快速构建响应式布局。
    *   **shadcn/ui** (可选): 基于 Radix UI 的高质量组件库，用于构建表单、弹窗等。
    *   **Lucide React**: 现代化的图标库。
*   **状态管理**: **Zustand** - 比 Redux 轻量，比 Context 性能好，适合管理“用户位置”、“生成的路线列表”等全局状态。
*   **路由**: **React Router v6/v7** - 标准选择。
*   **地图加载**: **百度地图 JS API** - 使用官方脚本加载或第三方 React 封装库。
*   **HTTP 请求**: **Axios** 或 **Ky** - 统一封装请求拦截器。

### 2.2 后端 (apps/api)
*   **基础框架**: NestJS (Express adapter)
*   **配置管理**: `@nestjs/config` - 管理环境变量 (API Keys, DB URL)。
*   **数据库交互**: `Prisma Client` - 定义 Schema (`schema.prisma`) 并自动生成强类型 Client。
*   **API 请求**: `@nestjs/axios` - 用于调用百度地图 Web 服务 API 和 LLM API。
*   **数据验证**: `class-validator` + `class-transformer` - 确保 API 输入输出符合 DTO 定义。

### 2.3 数据库 (Supabase)
*   **Core**: PostgreSQL 15+
*   **Connection**: 使用 Transaction Pooler (端口 6543) 连接 Prisma，避免 Serverless 环境下连接数耗尽。
*   **Auth**: 暂使用 Supabase Auth (Email/Phone) 或 匿名登录，MVP 阶段可简化为仅生成 UUID 标识设备。

### 2.4 地图与算法服务
*   **服务端 (Node.js)**: 调用百度地图 **Web 服务 API**。
    *   `骑行路径规划 (v4/direction/riding)`: 获取原始路径点、距离、红绿灯数（需确认字段）。
    *   `圆形区域搜索 (v2/place/search)`: 查询补给点。
*   **算法实现**: 纯 TypeScript 实现 `ScoringService`，不依赖重型 GIS 库 (如 GDAL)，仅使用轻量级几何计算库 (如 `turf.js` 的子模块) 进行角度和距离计算。

## 3. 部署架构 (MVP)

*   **前端**: **Vercel** - 零配置部署 Vite 应用，全球 CDN 加速。
*   **后端**: **Zeabur** 或 **Render** - 支持 NestJS 容器化部署，国内访问尚可，且有免费/低成本层。
*   **数据库**: **Supabase Cloud** - 托管的 PostgreSQL。

## 4. 关键依赖清单 (package.json)

### Root
*   `concurrently`: 并行启动前后端。
*   `husky` + `lint-staged`: 提交前检查。

### apps/web
*   `dependencies`: `react`, `react-dom`, `zustand`, `axios`, `@amap/amap-jsapi-loader`, `clsx`, `tailwind-merge`
*   `devDependencies`: `tailwindcss`, `postcss`, `autoprefixer`

### apps/api
*   `dependencies`: `@nestjs/common`, `@nestjs/core`, `@nestjs/config`, `@nestjs/axios`, `prisma`, `@prisma/client`, `class-validator`
*   `devDependencies`: `@types/node`

### packages/shared
*   共享的 TypeScript 接口 (`Route`, `UserProfile`) 和 DTO 定义，确保前后端类型一致。
