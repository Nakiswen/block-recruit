# Vercel + Neon/Supabase 部署指南

## 推荐拓扑

- `apps/web`: Vercel Next.js 项目。
- `apps/api`: Vercel Node.js Functions 项目，Koa 通过 `serverless-http` 暴露。
- Postgres: Neon 或 Supabase Postgres。
- Redis: Upstash Redis、Vercel KV 或支持 `rediss://` 的托管 Redis。
- 向量与 AI: 继续使用 Pinecone/OpenRouter，密钥只配置在 API 项目。

## 部署顺序

1. 准备 Postgres：Neon 或 Supabase 均可。
2. 准备 Redis：推荐 Upstash Redis，复制 `rediss://...` URL。
3. 准备 OpenRouter 和 Pinecone。
4. 在 Vercel 创建 API 项目并配置 API 环境变量。
5. 部署 API，确认 `https://your-api.vercel.app/health` 返回 ok。
6. 在 Vercel 创建 Web 项目并配置 Web 环境变量。
7. 在 Google Cloud Console 配置 OAuth 回调地址。
8. 部署 Web。

## Vercel 项目设置

建议在 Vercel 创建两个项目，指向同一个 Git 仓库：

| 项目 | Root Directory | Build Command |
| --- | --- | --- |
| Web | `apps/web` | `pnpm run build` |
| API | `apps/api` | `pnpm run vercel-build` |

API 项目的 `vercel.json` 会把 `/:path*` rewrite 到 `api/[...path].ts`，所以部署后外部路径仍是 `/health`、`/jobs`、`/resumes/upload` 等。

Web 生产环境设置 `NEXT_PUBLIC_API_URL=https://your-api.vercel.app`。本地开发可以不设置，默认走 `/api/business` 代理到 `http://localhost:3001`。

## Neon/Supabase 连接串

Prisma schema 已区分运行时连接和迁移连接：

- `WEB3CV_DATABASE_URL`: 运行时 pooled URL。
- `WEB3CV_DIRECT_URL`: 迁移用 direct URL。
- `WEB3JOBS_DATABASE_URL`: 运行时 pooled URL。
- `WEB3JOBS_DIRECT_URL`: 迁移用 direct URL。

Neon 通常使用 pooled host 给 `*_DATABASE_URL`，direct host 给 `*_DIRECT_URL`。Supabase 通常使用 transaction/session pooler 给运行时，direct database URL 给迁移。

可以把两个 schema 指向同一个 Postgres，也可以分两个数据库：

- 简单部署：`WEB3CV_*` 和 `WEB3JOBS_*` 都填同一个 Neon/Supabase 项目的 URL。
- 隔离部署：用户/简历库和岗位库分别用不同 Postgres。

迁移命令：

```bash
pnpm --filter block-recruit-api run migrate:deploy:web3cv
pnpm --filter block-recruit-api run migrate:deploy:web3jobs
```

## 环境变量分配

### Web 项目必填

这些填在 Vercel 的 `apps/web` 项目：

```bash
NEXT_PUBLIC_API_URL=https://your-api.vercel.app
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=https://your-web.vercel.app
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=<google-oauth-client-id>
AUTH_GOOGLE_SECRET=<google-oauth-client-secret>
```

如果 Web 端需要直接调用 Supabase browser client，再加：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Google OAuth 回调地址：

```text
https://your-web.vercel.app/api/auth/callback/google
```

### API 项目必填

这些填在 Vercel 的 `apps/api` 项目：

```bash
API_PUBLIC_URL=https://your-api.vercel.app
CORS_ORIGIN=https://your-web.vercel.app
JWT_SECRET=<openssl rand -base64 32>
WEB3CV_DATABASE_URL=<pooled-postgres-url>
WEB3CV_DIRECT_URL=<direct-postgres-url>
WEB3JOBS_DATABASE_URL=<pooled-postgres-url>
WEB3JOBS_DIRECT_URL=<direct-postgres-url>
REDIS_URL=<rediss://...>
OPENROUTER_API_KEY=<openrouter-key>
PINECONE_API_KEY=<pinecone-key>
PINECONE_JOB_INDEX_NAME=<job-index-name>
PINECONE_JOB_INDEX_HOST=<job-index-host>
PINECONE_RESUME_INDEX_NAME=<resume-index-name>
PINECONE_RESUME_INDEX_HOST=<resume-index-host>
EMBEDDING_API_KEY=<embedding-provider-key>
```

常用可选项：

```bash
AI_MODEL=anthropic/claude-sonnet-4.5
AI_API_BASE_URL=https://openrouter.ai/api/v1
USE_V2_MATCHING=false
MAX_UPLOAD_BYTES=4194304
EMBEDDING_API_URL=
EMBEDDING_MODEL=
EMBEDDING_DIMENSIONS=1024
```

### 迁移命令

在 API 项目环境变量配置完成后执行：

```bash
pnpm --filter block-recruit-api run migrate:deploy:web3cv
pnpm --filter block-recruit-api run migrate:deploy:web3jobs
```

如果两个 schema 指向同一个数据库，两个迁移命令仍然都要跑，因为它们对应不同 Prisma schema。

## 注意事项

- Vercel Function 请求体适合小文件；`MAX_UPLOAD_BYTES` 默认在 Vercel 下为 4MB。大简历文件建议改成 Supabase Storage 或 Vercel Blob 直传，再把文件 URL 交给 API 处理。
- 当前简历解析、OCR、AI 匹配和向量化仍在请求触发的异步流程里。生产高并发建议拆成队列 worker，例如 Upstash QStash、Inngest、Trigger.dev 或独立 Node worker。
- `OPENROUTER_API_KEY`、数据库连接串、Supabase service role key 不要放在 web 项目的 `NEXT_PUBLIC_*` 或 `next.config.js env` 中。
- Prisma Client 现在生成到 `apps/api/generated/prisma`，该目录不提交；Vercel API 项目的 `vercel-build` 会自动生成。

## 删除旧服务器前检查

旧 Linode 删除前，需要确认这些依赖已经迁走：

1. `jobs.openbuild.xyz` DNS 不再解析到旧服务器 IP，改为 Vercel 项目域名，或在 Vercel 中绑定该自定义域名。
2. Vercel API 项目不要继续使用旧服务器上的 Redis。推荐配置托管 Redis 的 `REDIS_URL=rediss://...`，例如 Upstash Redis 或 Vercel KV。
3. Vercel API 项目的 `WEB3CV_DATABASE_URL`、`WEB3JOBS_DATABASE_URL`、`WEB3CV_DIRECT_URL`、`WEB3JOBS_DIRECT_URL` 均指向 Neon/Supabase，不再指向旧服务器 Postgres。
4. Google OAuth 的 Authorized origins 和 redirect URI 改为新的 Web 域名。
5. 本地 `.env.local` 如果不再需要迁移旧数据，也应移除 `LEGACY_*` 旧服务器连接，或至少不要把 `WEB3CV_*` / `WEB3JOBS_*` 指向旧服务器。
6. 新 Vercel 部署通过 smoke test 后，再关停旧服务器：API `/health`、Web 首页、Google 登录、职位列表、简历上传/解析。
