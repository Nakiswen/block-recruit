# 实施计划

- [x] 1. 准备升级环境
  - 创建备份分支用于安全回滚
  - 记录当前的 React 18 和 Next.js 14.1.0 版本
  - 提交所有未提交的更改
  - _需求: 1.1, 1.2, 1.3_

- [x] 2. 更新 apps/web 的核心依赖
  - [x] 2.1 更新 apps/web/package.json 中的 Next.js 和 React
    - 将 `next` 从 `14.1.0` 更新到 `^15.0.0`
    - 将 `react` 从 `^18` 更新到 `^19.0.0`
    - 将 `react-dom` 从 `^18` 更新到 `^19.0.0`
    - 将 `@types/react` 从 `^18` 更新到 `^19`
    - 将 `@types/react-dom` 从 `^18` 更新到 `^19`
    - 将 `eslint-config-next` 从 `14.1.0` 更新到 `^15.0.0`
    - _需求: 1.1, 1.2, 1.4_
  
  - [x] 2.2 更新 apps/web 的 React 依赖库
    - 将 `@headlessui/react` 从 `^1.7.18` 更新到 `^2.0.0`
    - 将 `framer-motion` 从 `^10.16.16` 更新到 `^11.0.0`
    - 验证 `jotai`、`react-markdown`、`react-transition-group` 的兼容性
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 3. 更新 packages/ui 的依赖
  - [x] 3.1 更新 packages/ui/package.json
    - 将 devDependencies 中的 `next` 更新到 `^15.0.0`
    - 将 devDependencies 中的 `react` 更新到 `^19.0.0`
    - 将 `@types/react` 更新到 `^19`
    - 将 `@types/react-dom` 更新到 `^19`
    - 将 `eslint-config-next` 更新到 `^15.0.0`
    - 将 `@headlessui/react` 更新到 `^2.0.0`
    - _需求: 4.1, 4.2, 4.3_

- [x] 4. 更新根目录依赖
  - [x] 4.1 更新根 package.json
    - 将 `next` 从 `^13.4.1` 更新到 `^15.0.0`
    - 将 `eslint-config-next` 从 `^14.1.0` 更新到 `^15.0.0`
    - 验证没有 React 版本冲突
    - _需求: 6.1, 6.3_

- [x] 5. 安装依赖并解决冲突
  - [x] 5.1 运行 pnpm install
    - 执行 `pnpm install` 安装所有更新的依赖
    - 检查并记录任何对等依赖警告
    - _需求: 1.5, 6.2_
  
  - [x] 5.2 解决对等依赖冲突
    - 如有冲突，使用 `pnpm install --force` 或更新冲突的包
    - 确保所有包成功安装
    - _需求: 1.5, 6.2_

- [x] 6. 处理 Next.js 15 破坏性变更
  - [x] 6.1 更新异步请求 API 使用
    - 搜索所有使用 `cookies()` 的地方
    - 搜索所有使用 `headers()` 的地方
    - 将这些调用更新为 `await cookies()` 和 `await headers()`
    - 将包含这些调用的函数标记为 `async`
    - _需求: 3.2_
  
  - [x] 6.2 检查并更新 fetch 缓存策略
    - 搜索所有服务器端的 `fetch` 调用
    - 如需缓存，显式添加 `{ cache: 'force-cache' }`
    - 验证缓存行为符合预期
    - _需求: 3.3_
  
  - [x] 6.3 验证 next.config.js 配置
    - 检查 `rewrites` 配置是否仍然有效
    - 验证 `webpack` 配置与 Next.js 15 兼容
    - 确认 `transpilePackages` 配置正常工作
    - _需求: 3.2_

- [x] 7. 处理 React 19 破坏性变更
  - [x] 7.1 搜索已弃用的 React API
    - 搜索 `forwardRef` 的使用（可选迁移）
    - 搜索 `useContext` 的使用（保持不变）
    - 检查是否有其他已弃用的 API
    - _需求: 3.1, 3.4_
  
  - [x] 7.2 验证组件渲染行为
    - 检查状态更新和自动批处理
    - 验证 useEffect 的时序
    - 测试事件处理器中的状态更新
    - _需求: 3.5, 3.6_

- [x] 8. 处理 @headlessui/react 2.0 升级
  - [x] 8.1 检查 Headless UI 破坏性变更
    - 查看 @headlessui/react 2.0 的迁移指南
    - 识别项目中使用的 Headless UI 组件
    - 更新组件使用方式以匹配新 API
    - _需求: 2.2_

- [x] 9. 处理 framer-motion 11.0 升级
  - [x] 9.1 检查 Framer Motion 破坏性变更
    - 查看 framer-motion 11.0 的变更日志
    - 识别项目中使用的动画组件
    - 更新动画配置以匹配新 API
    - _需求: 2.3_

- [x] 10. 修复 TypeScript 类型错误
  - [x] 10.1 运行类型检查
    - 在 apps/web 中运行 `npx tsc --noEmit`
    - 在 packages/ui 中运行 `npx tsc --noEmit`
    - 记录所有类型错误
    - _需求: 1.3_
  
  - [x] 10.2 修复类型错误
    - 更新组件类型签名以匹配 React 19
    - 修复 Next.js 15 相关的类型问题
    - 更新导入语句（如需要）
    - _需求: 1.3, 3.1_

- [-] 11. 构建验证
  - [ ] 11.1 构建所有包
    - 运行 `pnpm run build` 构建整个 monorepo
    - 验证构建成功完成
    - 检查构建输出是否有警告
    - _需求: 1.6, 5.2, 6.4_
  
  - [x] 11.2 修复构建错误
    - 如有构建错误，分析错误原因
    - 修复代码或配置问题
    - 重新运行构建直到成功
    - _需求: 1.6, 5.2_

- [x] 12. 开发服务器验证
  - [x] 12.1 启动开发服务器
    - 运行 `pnpm run dev` 启动开发服务器
    - 验证服务器成功启动
    - 检查控制台是否有错误或警告
    - _需求: 5.1_
  
  - [x] 12.2 测试页面渲染
    - 在浏览器中访问主页
    - 测试所有主要路由（/jobs, /resume, /resume/[id]）
    - 验证页面正确渲染，无控制台错误
    - _需求: 5.3_

- [x] 13. 功能测试
  - [x] 13.1 测试核心功能
    - 测试钱包连接功能
    - 测试简历上传和解析
    - 测试职位匹配显示
    - 测试 NFT 成就展示
    - 测试页面导航
    - _需求: 5.4_

- [x] 14. Lint 和代码质量检查
  - [x] 14.1 运行 linter
    - 运行 `pnpm run lint` 检查代码质量
    - 记录所有 linting 错误和警告
    - _需求: 5.5, 4.6_
  
  - [x] 14.2 修复 linting 问题
    - 运行 `pnpm run lint:fix` 自动修复问题
    - 手动修复无法自动修复的问题
    - 重新运行 linter 直到通过
    - _需求: 5.5, 4.6_

- [-] 15. 最终验证和清理
  - [x] 15.1 完整回归测试
    - 重新测试所有核心功能
    - 验证没有视觉回归
    - 确认性能没有明显下降
    - _需求: 5.4_
  
  - [x] 15.2 更新文档
    - 更新 README.md 中的版本信息
    - 记录任何新的配置或使用说明
    - 添加升级说明（如需要）
    - _需求: 6.5_
  
  - [-] 15.3 提交更改
    - 提交所有更改到 git
    - 编写清晰的提交消息
    - 创建 pull request 供审查
    - _需求: 6.5_
