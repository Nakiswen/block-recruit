# Pinecone 配置教程

## 简介

Pinecone 是一个向量数据库，在本项目中用于存储和检索文档（岗位和简历）的向量表示，支持高效的语义搜索和匹配功能。

## 账号注册与设置

1. 访问 [Pinecone 官网](https://www.pinecone.io/) 并注册账号
2. 完成注册后登录到 Pinecone 控制台
3. 创建一个新的项目或使用现有项目

## API 密钥获取

1. 在 Pinecone 控制台，点击左侧导航栏的 "API Keys"
2. 复制现有的 API 密钥或创建新的 API 密钥
3. 保存此 API 密钥，用于项目配置

## 创建索引

本项目需要创建两个 Pinecone 索引：

### 岗位索引

1. 在 Pinecone 控制台，点击 "Create Index"
2. 填写以下信息：
   - 索引名称：`job-vectors`（或自定义名称）
   - 向量维度：`1024`（与embedding模型维度一致）
   - 度量类型：`cosine`（余弦相似度）
3. 点击 "Create Index" 完成创建
4. 创建后，记录下索引的主机地址（例如：`https://job-vectors-xxxx.svc.xxxx.pinecone.io`）

### 简历索引

1. 在 Pinecone 控制台，点击 "Create Index"
2. 填写以下信息：
   - 索引名称：`resume-vectors`（或自定义名称）
   - 向量维度：`1024`（与embedding模型维度一致）
   - 度量类型：`cosine`（余弦相似度）
3. 点击 "Create Index" 完成创建
4. 创建后，记录下索引的主机地址（例如：`https://resume-vectors-xxxx.svc.xxxx.pinecone.io`）

## 环境变量配置

在项目的 `.env` 文件中，添加以下 Pinecone 相关的环境变量：

```
# Pinecone 配置
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_JOB_INDEX_NAME=job-vectors
PINECONE_JOB_INDEX_HOST=https://job-vectors-xxxx.svc.xxxx.pinecone.io
PINECONE_RESUME_INDEX_NAME=resume-vectors
PINECONE_RESUME_INDEX_HOST=https://resume-vectors-xxxx.svc.xxxx.pinecone.io
```

## 验证配置

可以通过运行项目的测试脚本来验证 Pinecone 配置是否正确：

```bash
npm run test:rag
```

如果配置正确，你将看到类似以下的输出：

```
岗位索引连接成功，向量数量: XX
简历索引连接成功，向量数量: XX
```

## 故障排除

### 常见问题

1. **连接错误**：
   - 检查 API 密钥是否正确
   - 确认索引名称和主机地址是否正确
   - 检查网络连接是否正常

2. **索引不存在错误**：
   - 确认已经创建了对应名称的索引
   - 检查索引名称是否与环境变量一致

3. **向量维度不匹配**：
   - 确保索引的向量维度与 Embedding 模型输出的向量维度一致

4. **配额限制**：
   - Pinecone 免费版有操作次数限制，检查是否达到限制
   - 考虑升级到付费版获取更高配额

## 高级配置

### 调整索引参数

对于生产环境，可以调整以下参数以优化性能：

1. **副本数量**：增加副本可提高读取性能和可用性
2. **pod 类型**：根据工作负载选择适合的 pod 类型
3. **元数据过滤**：利用元数据过滤功能优化查询效率

### 安全建议

1. 定期轮换 API 密钥
2. 限制 API 密钥的权限范围
3. 不要在客户端代码中暴露 API 密钥

## 资源链接

- [Pinecone 官方文档](https://docs.pinecone.io/)
- [Pinecone JavaScript SDK](https://github.com/pinecone-io/pinecone-ts-client) 