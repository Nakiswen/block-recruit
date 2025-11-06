# 设计文档：React 19 升级

## 概述

本设计文档概述了将 Block Recruit Web 应用从 React 18 升级到 React 19 的技术方案。升级将采用增量方式进行以降低风险，从依赖更新开始，然后进行代码迁移，最后进行验证。该设计考虑了使用 pnpm workspaces 的 monorepo 结构。

### 关键考虑因素

- **Next.js 升级**: 从 Next.js 14.1.0 升级到 Next.js 15，以获得对 React 19 的完整稳定支持
- **Monorepo 结构**: 变更必须在 `/apps/web` 和 `/packages/ui` 之间协调
- **对等依赖**: 多个库依赖 React 作为对等依赖
- **破坏性变更**: React 19 和 Next.js 15 都引入了需要处理的破坏性变更
- **TypeScript**: 类型定义必须更新到 React 19 和 Next.js 15

## 架构

### 升级策略

升级遵循分阶段方法：

1. **阶段 1：依赖分析** - 识别所有依赖 React 和 Next.js 的包及其兼容性
2. **阶段 2：包更新** - 同时更新 React 19 和 Next.js 15 及相关依赖
3. **阶段 3：Next.js 迁移** - 处理 Next.js 15 的破坏性变更和新特性
4. **阶段 4：React 迁移** - 处理 React 19 的破坏性变更和已弃用的 API
5. **阶段 5：验证** - 测试构建、开发服务器和功能
6. **阶段 6：清理** - 删除已弃用的代码并更新文档

### 依赖关系图

```
apps/web
├── react@19
├── react-dom@19
├── next@15 (完整支持 React 19)
├── @types/react@19
├── @types/react-dom@19
└── React 依赖库
    ├── @headlessui/react (需要版本检查)
    ├── framer-motion (需要版本检查)
    ├── jotai (需要版本检查)
    ├── react-markdown (需要版本检查)
    └── react-transition-group (需要版本检查)

packages/ui
├── react@19 (peerDependency)
├── react-dom@19 (peerDependency)
├── next@15 (devDependency)
├── @types/react@19 (devDependency)
└── @headlessui/react (需要版本检查)
```

## 组件和接口

### 1. Package.json 更新

**apps/web/package.json**
- 将 `next` 更新到 `^15.0.0`
- 将 `react` 和 `react-dom` 更新到 `^19.0.0`
- 将 `@types/react` 和 `@types/react-dom` 更新到 `^19`
- 将 `eslint-config-next` 更新到 `^15.0.0`
- 将依赖 React 的库更新到兼容版本

**packages/ui/package.json**
- 将 `next` devDependency 更新到 `^15.0.0`
- 将 `react` 和 `react-dom` devDependencies 更新到 `^19.0.0`
- 将 `@types/react` 和 `@types/react-dom` 更新到 `^19`
- 将 `eslint-config-next` 更新到 `^15.0.0`
- 更新 peerDependencies 以接受 React 19
- 如需要，更新 `@headlessui/react`

**根目录 package.json**
- 将 `next` 更新到 `^15.0.0`
- 将 `eslint-config-next` 更新到 `^15.0.0`
- 验证没有冲突的 React 版本
- 更新任何根级别的 React 依赖

### 2. Next.js 15 配置变更

**next.config.js**
- Next.js 15 默认使用 Turbopack 作为开发服务器（可选）
- 检查并更新 `rewrites` 配置（API 保持兼容）
- 验证 `webpack` 配置仍然有效
- 检查 `transpilePackages` 配置

**TypeScript 配置**
- 当前的 TypeScript 配置使用 `jsx: "preserve"` 与 React 19 和 Next.js 15 兼容
- Next.js 15 内部处理 JSX 转换
- 可能需要更新 `moduleResolution` 为 `"bundler"`（已配置）

### 3. Next.js 15 破坏性变更

#### 变更 1：异步请求 API
Next.js 15 中，`headers()`、`cookies()` 和 `params` 现在是异步的。

**之前 (Next.js 14):**
```tsx
import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
}
```

**之后 (Next.js 15):**
```tsx
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
}
```

**策略**: 搜索所有使用 `headers()`、`cookies()` 的地方，添加 `await` 并将函数标记为 `async`。

#### 变更 2：fetch 缓存默认值
Next.js 15 将 `fetch` 请求的默认缓存从 `force-cache` 改为 `no-store`。

**策略**: 
- 检查所有 `fetch` 调用
- 如需缓存，显式添加 `{ cache: 'force-cache' }`
- 当前项目主要在客户端使用 axios，影响较小

#### 变更 3：Route Handlers 的 GET 函数
GET 路由处理器默认不再缓存。

**策略**: 如需缓存，使用 `export const dynamic = 'force-static'`

### 4. React 19 代码迁移模式

#### 破坏性变更 1：Ref 转发
React 19 简化了 ref 处理。在许多情况下，组件不再需要 `forwardRef`。

**之前 (React 18):**
```tsx
const MyComponent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});
```

**之后 (React 19):**
```tsx
const MyComponent = ({ ref, ...props }: Props & { ref?: Ref<HTMLDivElement> }) => {
  return <div ref={ref}>{props.children}</div>;
};
```

**策略**: 初始保持现有的 `forwardRef` 使用（仍然支持），如需要可增量迁移。

#### 破坏性变更 2：Context API
React 19 改变了 context 的使用方式。`use` hook 可以替代 `useContext`。

**之前 (React 18):**
```tsx
const value = useContext(MyContext);
```

**之后 (React 19 - 可选):**
```tsx
const value = use(MyContext);
```

**策略**: 保持现有的 `useContext` 使用（仍然支持），无需立即迁移。

#### 破坏性变更 3：自动批处理
React 19 将自动批处理扩展到更多场景。这主要是向后兼容的，但可能影响时间敏感的代码。

**策略**: 测试事件处理器和异步函数中的状态更新，确保预期行为。

### 5. 依赖兼容性矩阵

基于研究，以下版本与 React 19 和 Next.js 15 兼容：

| 包 | 当前版本 | 目标版本 | 备注 |
|---------|----------------|----------------|-------|
| next | 14.1.0 | ^15.0.0 | 主版本更新，有破坏性变更 |
| react | ^18 | ^19.0.0 | 主版本更新 |
| react-dom | ^18 | ^19.0.0 | 主版本更新 |
| @types/react | ^18 | ^19 | 类型定义更新 |
| @types/react-dom | ^18 | ^19 | 类型定义更新 |
| eslint-config-next | 14.1.0 | ^15.0.0 | 与 Next.js 版本匹配 |
| @headlessui/react | ^1.7.18 | ^2.0.0 | 需要主版本更新 |
| framer-motion | ^10.16.16 | ^11.0.0 | 检查破坏性变更 |
| jotai | ^2.6.0 | ^2.6.0+ | 已兼容 |
| react-markdown | ^10.1.0 | ^10.1.0+ | 已兼容 |
| react-transition-group | ^4.4.5 | ^4.4.5+ | 已兼容 |
| @heroicons/react | ^2.1.1 | ^2.1.1+ | 已兼容 |

## 数据模型

无需更改数据模型。React 19 保持与现有组件 props 和状态结构的向后兼容性。

## 错误处理

### 构建错误

**对等依赖冲突**
- **检测**: pnpm 将报告对等依赖警告/错误
- **解决**: 如有必要使用 `pnpm install --force`，或更新冲突的包
- **后备方案**: 在 package.json 中固定特定版本以解决冲突

**类型错误**
- **检测**: TypeScript 编译将因类型不匹配而失败
- **解决**: 更新类型导入和组件签名
- **后备方案**: 对于复杂的类型问题，暂时使用 `@ts-expect-error`，记录以便后续修复

### 运行时错误

**组件渲染问题**
- **检测**: 浏览器控制台错误或视觉回归
- **解决**: 查看 React 19 迁移指南了解特定组件模式
- **后备方案**: 如需要，将特定组件恢复到 React 18 模式

**Hook 行为变更**
- **检测**: 意外的状态更新或 effect 时序
- **解决**: 检查 useEffect 依赖项和状态更新模式
- **后备方案**: 添加显式依赖项，或在时序关键时使用 useLayoutEffect

## 测试策略

### 1. 升级前验证
- 记录当前应用状态
- 捕获关键页面的截图
- 记录控制台中的任何现有警告
- 运行现有测试（如有）以建立基线

### 2. 构建验证
```bash
# 清洁安装
pnpm install

# 构建所有包
pnpm run build

# 检查构建错误
echo $?
```

### 3. 开发服务器验证
```bash
# 启动开发服务器
pnpm run dev

# 在浏览器中验证：
# - 主页加载
# - 导航工作
# - 无控制台错误
# - 所有页面正确渲染
```

### 4. 功能测试

测试以下关键路径：
- **钱包连接**: 连接钱包功能
- **简历上传**: 上传和解析简历
- **职位匹配**: 查看匹配的职位
- **NFT 展示**: 查看 NFT 成就
- **导航**: 所有路由正常工作

### 5. Lint 验证
```bash
# 运行 linter
pnpm run lint

# 修复可自动修复的问题
pnpm run lint:fix
```

### 6. 类型检查
```bash
# 类型检查所有包
cd apps/web && npx tsc --noEmit
cd packages/ui && npx tsc --noEmit
```

## 迁移检查清单

### 迁移前
- [ ] 提交所有当前更改
- [ ] 创建备份分支
- [ ] 记录当前 React 版本
- [ ] 运行基线测试

### 依赖更新
- [ ] 更新 apps/web/package.json
- [ ] 更新 packages/ui/package.json
- [ ] 更新根目录 package.json（如需要）
- [ ] 运行 pnpm install
- [ ] 解决对等依赖冲突

### 代码更新
- [ ] 搜索已弃用的 React API
- [ ] 如需要更新组件模式
- [ ] 修复 TypeScript 错误
- [ ] 如需要更新导入语句

### 验证
- [ ] 构建成功
- [ ] 开发服务器启动
- [ ] 所有页面渲染
- [ ] 无控制台错误
- [ ] Linter 通过
- [ ] 类型检查通过

### 迁移后
- [ ] 更新文档
- [ ] 删除临时解决方案
- [ ] 提交更改
- [ ] 创建 pull request

## 回滚计划

如果遇到关键问题：

1. **立即回滚**: `git reset --hard HEAD`（如果未提交）
2. **分支回滚**: `git checkout <backup-branch>`
3. **选择性回滚**: 恢复特定的 package.json 更改并运行 `pnpm install`

## Next.js 15 新特性

升级到 Next.js 15 后，可以利用以下新特性：

### 1. Turbopack 开发服务器（稳定版）
- 更快的开发服务器启动和热更新
- 可选启用：`next dev --turbo`

### 2. 改进的缓存控制
- 更精细的缓存控制选项
- 更好的开发体验

### 3. 增强的错误处理
- 更清晰的错误消息
- 更好的堆栈跟踪

### 4. React 19 完整支持
- 稳定的 React 19 集成
- 支持所有 React 19 新特性

## 参考资料

- React 19 发布说明: https://react.dev/blog/2024/12/05/react-19
- Next.js React 19 支持: https://nextjs.org/docs/app/building-your-application/upgrading/version-15
- React 19 升级指南: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- pnpm Workspace 文档: https://pnpm.io/workspaces
