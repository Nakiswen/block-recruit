# 需求文档

## 简介

本文档概述了将 Block Recruit Web 应用从 React 18 升级到 React 19，以及从 Next.js 14.1.0 升级到 Next.js 15 的需求。React 19 和 Next.js 15 引入了新功能、性能改进和需要仔细迁移的破坏性变更。升级将影响 `/apps/web` 目录和共享 UI 包，确保所有依赖的兼容性。

## 术语表

- **Web Application（Web 应用）**: 位于 `/apps/web` 的基于 Next.js 的前端应用
- **React**: 用于构建用户界面的 JavaScript 库，当前版本为 18
- **Next.js**: 用于服务器端渲染和路由的 React 框架
- **UI Package（UI 包）**: 位于 `/packages/ui` 的共享组件库
- **Dependency Tree（依赖树）**: npm 包及其版本要求的集合
- **Breaking Changes（破坏性变更）**: React 19 中需要代码更新的 API 修改
- **Type Definitions（类型定义）**: React 和 React DOM 的 TypeScript 声明文件

## 需求

### 需求 1

**用户故事:** 作为开发者，我想将 React 升级到版本 19 并将 Next.js 升级到版本 15，以便应用能够受益于最新功能和性能改进

#### 验收标准

1. Web Application 应使用 React 版本 19.x 和 React DOM 版本 19.x
2. Web Application 应使用 Next.js 版本 15.x
3. Web Application 应将所有 React 相关的类型定义更新到版本 19
4. Web Application 应将 eslint-config-next 更新到版本 15.x
5. Web Application 应解决依赖树中的所有对等依赖冲突
6. Web Application 应在升级后成功构建且无错误

### 需求 2

**用户故事:** 作为开发者，我想更新依赖 React 的库，以便所有依赖都与 React 19 兼容

#### 验收标准

1. 当依赖需要 React 作为对等依赖时，Web Application 应验证与 React 19 的兼容性
2. Web Application 应将 @headlessui/react 更新到与 React 19 兼容的版本
3. Web Application 应将 framer-motion 更新到与 React 19 兼容的版本
4. Web Application 应将 jotai 更新到与 React 19 兼容的版本
5. Web Application 应将 react-markdown 更新到与 React 19 兼容的版本
6. Web Application 应将 react-transition-group 更新到与 React 19 兼容的版本

### 需求 3

**用户故事:** 作为开发者，我想识别并修复破坏性变更，以便应用在升级后继续正常运行

#### 验收标准

1. Web Application 应将已弃用的 React API 替换为其 React 19 等效项
2. 当使用 Next.js 15 的异步请求 API 时，Web Application 应更新所有 `headers()`、`cookies()` 调用为异步
3. Web Application 应处理 Next.js 15 中 fetch 缓存默认值的变更
4. Web Application 应更新与 React 19 不兼容的组件模式
5. Web Application 应处理 React 渲染行为的变更
6. Web Application 应处理 React 19 中 hooks 行为的任何变更

### 需求 4

**用户故事:** 作为开发者，我想更新共享 UI 包，以便所有 workspace 包使用一致的 React 版本

#### 验收标准

1. UI Package 应使用 React 版本 19.x 作为对等依赖
2. UI Package 应将类型定义更新到 React 19
3. UI Package 应将 Next.js 更新到版本 15.x
4. UI Package 应保持与现有使用者的 API 兼容性
5. 当构建 UI Package 时，构建过程应无错误完成
6. UI Package 应通过所有使用 React 19 的 linting 检查

### 需求 5

**用户故事:** 作为开发者，我想验证应用正常工作，以便升级不会破坏任何功能

#### 验收标准

1. Web Application 应无错误启动开发服务器
2. Web Application 应无错误构建生产版本
3. Web Application 应无运行时错误渲染所有现有页面
4. Web Application 应在升级后保持所有现有功能
5. 当运行 linter 时，Web Application 应通过所有检查

### 需求 6

**用户故事:** 作为开发者，我想更新 workspace 依赖，以便 monorepo 维护一致的包版本

#### 验收标准

1. 根目录 package.json 应不与 React 19 和 Next.js 15 依赖冲突
2. 当使用 pnpm workspace 时，依赖解析应对所有包成功
3. Web Application 应使用来自 workspace 的正确 React 和 Next.js 版本
4. turbo 构建系统应成功构建所有使用 React 19 和 Next.js 15 的包
5. pnpm-lock.yaml 文件应反映更新的 React 19 和 Next.js 15 依赖
