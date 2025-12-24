# Google OAuth 登录迁移 - 变更日志

## 📦 新增文件

### 前端
- `apps/web/app/api/auth/[...nextauth]/route.ts` - NextAuth API 路由配置
- `apps/web/app/providers.tsx` - SessionProvider 包装器
- `packages/ui/components/GoogleSignIn.tsx` - Google 登录组件
- `store/authAtoms.ts` - 新的认证状态管理

### 配置文件
- `apps/web/.env.example` - 环境变量示例（已更新）
- `GOOGLE_AUTH_SETUP.md` - Google OAuth 配置指南
- `CHANGELOG_GOOGLE_AUTH.md` - 本文件

## 📝 修改文件

### 前端组件
- `apps/web/app/layout.tsx` - 添加 SessionProvider，移除钱包连接逻辑
- `packages/ui/components/Navigation.tsx` - 支持 Google 登录模式
- `packages/ui/index.tsx` - 导出 GoogleSignIn 组件

### 数据库
- `prisma/web3cv.prisma` - User 模型更新:
  - `address` → 可选（String?）
  - `email` → 唯一约束
  - 新增 `googleId` (String?, unique)
  - 新增 `avatar` (String?)

### 配置
- `apps/web/package.json` - 添加 next-auth v5
- `apps/web/.env.local` - 添加 Google OAuth 环境变量

## 🔄 备份文件

以下文件已备份（可用于回滚）:
- `apps/web/app/layout_old.tsx`
- `packages/ui/components/Navigation_old.tsx`

## 🚀 部署前必须完成

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
在 `apps/web/.env.local` 中填入:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`

### 3. 运行数据库迁移
```bash
cd apps/api
npx prisma migrate dev --name add_google_auth --schema ../../prisma/web3cv.prisma
npx prisma generate --schema ../../prisma/web3cv.prisma
```

## 📋 测试检查项

- [ ] Google 登录流程完整
- [ ] 登出功能正常
- [ ] Session 持久化（刷新页面）
- [ ] 用户信息显示正确（头像、邮箱）
- [ ] 数据库正确创建 Google 用户

## ⚠️ 注意事项

1. **向后兼容性**: 旧的钱包用户数据不受影响（address 字段仍存在）
2. **环境变量**: 必须配置 Google OAuth 凭据才能使用
3. **HTTPS 要求**: 生产环境必须使用 HTTPS
4. **数据库迁移**: 必须运行 Prisma 迁移才能启动应用

## 🔗 相关资源

- [配置指南](./GOOGLE_AUTH_SETUP.md)
- [NextAuth 文档](https://next-auth.js.org/)
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
