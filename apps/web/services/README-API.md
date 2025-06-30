# BlockRecruit API 客户端使用指南

本文档介绍如何使用自动生成的API客户端代码与后端进行交互。

## 生成API客户端代码

项目使用 OpenAPI/Swagger 规范自动生成API客户端代码，确保前后端接口一致性。

### 生成命令

```bash
# 在项目根目录下执行
npm run update-api  # 更新后端 Swagger 文档并生成前端 API 客户端

# 或者分步执行
npm run update-swagger  # 仅更新 Swagger 文档
npm run generate-api    # 仅生成 API 客户端代码
```

### 生成文件目录

生成的API客户端代码位于：`apps/web/services/api-client/`

## 使用API客户端

### 基本使用

```typescript
import { BlockRecruitAPI } from '../services/api-client';

// 创建API客户端实例
const api = new BlockRecruitAPI({
  // 可配置项
  BASE: process.env.NEXT_PUBLIC_API_URL,  // API基础URL
  TOKEN: token,  // JWT令牌（可选）
});

// 调用API方法
async function fetchJobs() {
  try {
    const jobs = await api.jobs.getJobs();
    return jobs;
  } catch (error) {
    console.error('获取工作列表失败:', error);
    throw error;
  }
}
```

### 认证

API客户端会自动在请求中添加JWT令牌。令牌可以通过以下方式提供：

1. 初始化时提供：
```typescript
const api = new BlockRecruitAPI({ TOKEN: 'your-jwt-token' });
```

2. 通过localStorage (默认方式):
API客户端会自动从localStorage中读取 'token' 项。

### 可用的服务

API客户端提供以下服务：

- `api.auth` - 用户认证相关接口
- `api.resumes` - 简历相关接口
- `api.jobs` - 岗位相关接口
- `api.users` - 用户相关接口
- `api.nft` - NFT证明相关接口
- `api.applications` - 岗位投递记录相关接口

### 请求示例

#### 获取登录挑战

```typescript
const { message, nonce } = await api.auth.getAuthChallenge(walletAddress);
```

#### 验证签名并登录

```typescript
const { token } = await api.auth.postAuthLogin({
  address: walletAddress,
  signature: signedMessage,
  nonce: challengeNonce
});
localStorage.setItem('token', token);
```

#### 上传简历

```typescript
const resumeFile = event.target.files[0];
const result = await api.resumes.postResumesUpload({ resume: resumeFile });
```

#### 获取匹配岗位

```typescript
const matchingJobs = await api.resumes.getResumesMatchingJobs(
  resumeId,
  0.7,  // 最小匹配分数
  '北京',  // 地点
  '区块链',  // 行业
  '本科',  // 教育水平
  2  // 工作经验年限
);
```

## 错误处理

API客户端会自动处理HTTP错误，如果后端返回非2xx状态码，会抛出带有状态码和错误信息的异常。

```typescript
try {
  await api.resumes.postResumesMatch();
} catch (error) {
  if (error.status === 401) {
    // 未授权，提示用户登录
    redirectToLogin();
  } else if (error.status === 404) {
    // 资源不存在
    showNotFoundMessage();
  } else {
    // 其他错误
    showErrorMessage(error.message);
  }
}
```

## 最佳实践

1. 在组件或页面外创建一个API实例，以便在整个应用中重用
2. 使用TypeScript类型定义，充分利用类型系统提供的提示和类型检查
3. 使用try-catch处理API错误，提供友好的用户反馈
4. 使用React Query或SWR等库进行数据获取和缓存管理 