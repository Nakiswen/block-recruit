# Google OAuth 登录配置指南

本项目已成功从钱包登录迁移到 Google OAuth 登录。以下是完成配置所需的步骤。

## 📋 已完成的改动

### 1. 依赖安装
- ✅ 已添加 `next-auth@^4.24.11` 到 `apps/web/package.json`
- ⚠️ 需要运行 `npm install` 安装依赖

### 2. NextAuth 配置
- ✅ 创建了 `/apps/web/app/api/auth/[...nextauth]/route.ts`
- ✅ 配置了 Google Provider
- ✅ 实现了 JWT 和 Session callbacks

### 3. 前端组件
- ✅ 创建了新的 Google 登录组件 `/packages/ui/components/GoogleSignIn.tsx`
- ✅ 更新了 Navigation 组件支持 Google 登录
- ✅ 创建了 SessionProvider 包装器 `/apps/web/app/providers.tsx`
- ✅ 更新了主布局文件 `apps/web/app/layout.tsx`

### 4. 全局状态管理
- ✅ 创建了新的认证状态管理 `/store/authAtoms.ts`
- ✅ 保留了旧的钱包状态管理以便后续兼容

### 5. 数据库 Schema
- ✅ 更新了 `/prisma/web3cv.prisma` 中的 User 模型
  - `address` 改为可选（支持非钱包用户）
  - `email` 添加唯一约束
  - 新增 `googleId` 字段（唯一）
  - 新增 `avatar` 字段

### 6. 环境变量
- ✅ 已添加到 `apps/web/.env.local` 和 `.env.example`

---

## 🔧 需要完成的配置步骤

### 步骤 1: 安装依赖
```bash
# 在项目根目录执行
npm install
```

### 步骤 2: 配置 Google Cloud Console

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID:
   - 应用类型: Web 应用
   - 授权的 JavaScript 来源:
     - `http://localhost:3000` (开发环境)
     - `https://yourdomain.com` (生产环境)
   - 授权的重定向 URI:
     - `http://localhost:3000/api/auth/callback/google` (开发环境)
     - `https://yourdomain.com/api/auth/callback/google` (生产环境)

5. 获取凭据:
   - 客户端 ID
   - 客户端密钥

### 步骤 3: 配置环境变量

编辑 `apps/web/.env.local` 文件，填入实际值:

```bash
# NextAuth Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# NextAuth 密钥 (运行命令生成)
NEXTAUTH_SECRET=your-generated-secret-here

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000  # 生产环境改为实际域名
```

**生成 NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 步骤 4: 运行数据库迁移

更新数据库以支持新的用户模型:

```bash
# 进入 API 目录
cd apps/api

# 生成迁移文件
npx prisma migrate dev --name add_google_auth --schema ../../prisma/web3cv.prisma

# 生成 Prisma Client
npx prisma generate --schema ../../prisma/web3cv.prisma
```

### 步骤 5: (可选) 更新后端 API

如果需要后端 API 也支持 Google 登录的用户，需要:

1. **更新用户模型查询** (`apps/api/src/models/usersModel.ts`):
```typescript
// 新增: 根据 email 查找用户
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

// 新增: 根据 googleId 查找用户
export async function findUserByGoogleId(googleId: string) {
  return await prisma.user.findUnique({
    where: { googleId }
  });
}

// 修改: 创建 Google 用户
export async function createGoogleUser(data: {
  email: string;
  googleId: string;
  nickname?: string;
  avatar?: string;
}) {
  return await prisma.user.create({
    data
  });
}
```

2. **添加 NextAuth Session 同步** (可选，如果需要后端识别登录用户):

在 `apps/web/lib/api.ts` 中添加拦截器，从 NextAuth session 获取 token:

```typescript
import { getSession } from 'next-auth/react';

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.email) {
    // 可以将用户信息添加到请求头
    config.headers['X-User-Email'] = session.user.email;
  }
  return config;
});
```

---

## 🧪 测试登录流程

### 开发环境测试

1. **启动开发服务器**:
```bash
npm run dev
```

2. **访问应用**:
   - 打开浏览器访问 `http://localhost:3000`
   - 点击 "使用 Google 登录" 按钮
   - 选择 Google 账号完成授权
   - 登录成功后应显示用户头像和邮箱

3. **验证登录状态**:
   - 刷新页面，登录状态应保持
   - 检查浏览器控制台无错误
   - 点击 "登出" 按钮，确认能正常退出

---

## 📝 API 变更说明

### 旧的钱包登录流程 (已废弃)
```
GET  /auth/challenge?address=0x...  → 获取签名消息
POST /auth/login { address, signature, nonce }  → 返回 JWT
```

### 新的 Google 登录流程
```
GET  /api/auth/signin/google  → 重定向到 Google OAuth
GET  /api/auth/callback/google?code=...  → Google 回调，创建 session
```

**NextAuth 自动处理:**
- Session 管理 (存储在 JWT 中)
- CSRF 保护
- 回调 URL 验证
- Token 刷新

---

## 🔄 回滚到钱包登录 (如果需要)

如果需要回滚到钱包登录:

1. **恢复布局文件**:
```bash
mv apps/web/app/layout_old.tsx apps/web/app/layout.tsx
```

2. **恢复 Navigation 组件**:
```bash
mv packages/ui/components/Navigation_old.tsx packages/ui/components/Navigation.tsx
```

3. **恢复数据库 schema**:
```bash
git checkout prisma/web3cv.prisma
npx prisma migrate dev --schema prisma/web3cv.prisma
```

---

## 📚 相关文档

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Next.js App Router 认证](https://nextjs.org/docs/app/building-your-application/authentication)

---

## ❓ 常见问题

### Q: 出现 "Invalid client" 错误?
A: 检查 Google Cloud Console 中的重定向 URI 是否正确配置。

### Q: Session 无法保持?
A: 确保 NEXTAUTH_SECRET 已正确设置且不为空。

### Q: 本地开发 Cookie 问题?
A: NextAuth 在开发环境默认使用 HTTP，生产环境需要 HTTPS。

### Q: 如何支持同时使用钱包和 Google 登录?
A: 需要额外开发双登录模式，修改 Navigation 组件同时显示两种登录方式。

---

## ✅ 完成检查清单

- [ ] 运行 `npm install` 安装 next-auth
- [ ] 在 Google Cloud Console 创建 OAuth 客户端
- [ ] 配置环境变量 (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET)
- [ ] 运行数据库迁移 `npx prisma migrate dev`
- [ ] 测试 Google 登录流程
- [ ] 测试退出登录功能
- [ ] 验证登录状态持久化
- [ ] (可选) 更新后端 API 以支持 Google 用户

---

**祝配置顺利！** 🎉
