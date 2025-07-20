# 硅基流动 Embedding 模型配置教程

## 简介

硅基流动（SiliconFlow）是一个提供AI模型服务的国内平台，本项目使用其提供的 BAAI/bge-m3 Embedding 模型来将文本转换为向量表示，用于语义搜索和匹配。

## 账号注册与设置

1. 访问 [硅基流动官网](https://www.siliconflow.cn/) 并注册账号
2. 完成邮箱验证和实名认证流程
3. 登录到控制台

## API 密钥获取

1. 在硅基流动控制台，找到 "API 密钥" 或 "API Keys" 选项
2. 创建一个新的 API 密钥（如果没有现有密钥）
3. 复制并安全保存该 API 密钥

## 环境变量配置

在项目的 `.env` 文件中，添加以下与 Embedding 模型相关的环境变量：

```
# Embedding 模型配置
EMBEDDING_API_KEY=your_siliconflow_api_key_here
EMBEDDING_DIMENSIONS=1024
```

## 模型详细信息

本项目使用的是 `BAAI/bge-m3` 模型，这是一个强大的多语言 Embedding 模型：

- **模型名称**: BAAI/bge-m3
- **向量维度**: 1024
- **支持语言**: 中文、英文等多语言
- **API 端点**: https://api.siliconflow.cn/v1/embeddings

## 调用示例

硅基流动的 Embedding API 调用示例（从项目代码中提取）：

```javascript
const response = await axios.post(
  'https://api.siliconflow.cn/v1/embeddings',
  {
    model: 'BAAI/bge-m3',
    input: text
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    timeout: 30000
  }
);

// 返回的向量在 response.data.data[0].embedding
const vector = response.data.data[0].embedding;
```

## 验证配置

可以通过运行项目的测试脚本来验证 Embedding 配置是否正确：

```bash
npm run test:rag
```

如果配置正确，你应该能看到岗位或简历文本被成功转换为向量并存储到 Pinecone。

## 故障排除

### 常见问题

1. **API 密钥错误**:
   - 检查 API 密钥是否正确输入
   - 确认 API 密钥是否已激活
   - 验证 API 密钥是否有权限访问 Embedding 模型

2. **网络连接问题**:
   - 确认网络连接正常
   - 检查是否需要设置代理
   - 尝试增加超时时间

3. **配额限制**:
   - 检查是否达到 API 调用配额限制
   - 考虑升级套餐以获取更高配额

4. **响应格式错误**:
   - 确认 API 端点是否正确
   - 检查请求格式是否符合要求
   - 查看响应错误信息以定位具体问题

## 高级配置

### 批量处理

对于大量文本的处理，可以使用批量 API 调用以提高效率：

```javascript
const response = await axios.post(
  'https://api.siliconflow.cn/v1/embeddings',
  {
    model: 'BAAI/bge-m3',
    input: textArray // 文本数组
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    timeout: 60000 // 批量处理需要更长的超时时间
  }
);

// 解析多个向量
const vectors = response.data.data
  .sort((a, b) => a.index - b.index)
  .map(item => item.embedding);
```

### 缓存机制

为减少 API 调用次数，项目实现了向量缓存机制：

1. 首次生成向量时存入内存缓存
2. 后续相同文本直接从缓存获取
3. 通过归一化文本和生成缓存键实现高效缓存

## 其他可用的 Embedding 模型

硅基流动还提供其他 Embedding 模型选择：

- **BAAI/bge-large-en-v1.5-icl**: 英文优化模型
- **BAAI/bge-large-zh-v1.5**: 中文优化模型
- **text-embedding-3-large**: 功能类似于 OpenAI 的高级 Embedding 模型

## 资源链接

- [硅基流动官方文档](https://www.siliconflow.cn/doc)
- [BAAI/bge-m3 模型详情](https://github.com/bge-m3)
- [向量嵌入最佳实践](https://www.siliconflow.cn/blog/embedding-best-practices) 