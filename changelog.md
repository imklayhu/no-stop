# Changelog

## 2026-01-28
- 引入 pnpm 工作空间，标准化 monorepo 结构（apps/*，packages/*）。
- 新增后端 apps/api（NestJS），启用 start:dev 本地开发，提供根路由。
- 前端迁移到 apps/web（Vite + React + Tailwind），本地代理到后端。
- 新增 packages/shared 共享包，在前端引用示例常量 appName。
- 统一根脚本：dev 并行启动前后端；build/lint/check 递归执行各包。
- 清理旧根前端与 Express 后端目录，消除历史 lint/ts 错误与冲突。
- 为各包 ESLint 设置 tsconfigRootDir，修复 IDE 多 tsconfig 解析错误。
- 移除根 tsconfig.json，改为各包独立 tsconfig；IDE/CLI 行为一致。
- 修复 pnpm-workspace.yaml 重复项，并添加 schema 注释以改善 IDE 体验。
- 验证通过：pnpm run check、pnpm run lint 全部通过；pnpm run dev 前后端运行正常。

### 本地地址
- 前端：http://localhost:5173/
- 后端：http://localhost:4000/
