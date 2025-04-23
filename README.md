# BlockRecruit - Web3 AI招聘助手

BlockRecruit是一个革命性的去中心化招聘协议，将先进的人工智能与区块链技术相结合，专为Web3行业打造。

## 特性

- 基于AI的简历筛选和匹配
- 智能面试系统
- 区块链技能验证
- Web3身份认证
- 去中心化治理

## 技术栈

- 前端: Next.js, TailwindCSS, Headless UI
- Web3集成: ethers.js, WalletConnect
- 状态管理: Jotai
- 后端: Node.js, Koa, GraphQL
- 数据库: MongoDB, Redis
- AI集成: OpenAI API/Claude API

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build
```

## 项目结构

- `apps/web` - Web应用前端
- `packages/ui` - 共享UI组件
- `packages/web3-utils` - Web3工具函数
- `packages/resume-parser` - 简历解析模块
- `packages/ai-engine` - AI评估引擎 