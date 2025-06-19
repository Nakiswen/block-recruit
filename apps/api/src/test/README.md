# RAG服务测试指南

本目录包含用于测试RAG（检索增强生成）服务的脚本，主要用于岗位和简历的向量化和匹配功能测试。

## 环境准备

在运行测试前，请确保已正确设置以下环境变量：

```
# Pinecone配置
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_JOB_INDEX_NAME=job-vectors
PINECONE_JOB_INDEX_HOST=https://job-vectors-xxxx.svc.xxxx.pinecone.io
PINECONE_RESUME_INDEX_NAME=resume-vectors
PINECONE_RESUME_INDEX_HOST=https://resume-vectors-xxxx.svc.xxxx.pinecone.io

# Embedding模型配置
OPENAI_API_KEY=your_openai_api_key
# 或使用HuggingFace模型
HF_API_KEY=your_huggingface_api_key
EMBEDDING_MODEL=BAAI/bge-large-en-v1.5-icl
EMBEDDING_DIMENSIONS=1024
```

## 测试脚本

### 1. 岗位数据向量化测试 (`rag-test.ts`)

测试从PostgreSQL数据库获取岗位数据并转换为向量存储到Pinecone。

```bash
npm run test:rag
```

### 2. 简历数据向量化测试 (`resume-rag-test.ts`)

测试从PostgreSQL数据库获取简历数据并转换为向量存储到Pinecone。

```bash
npm run test:resume-rag
```

### 3. 岗位-简历匹配测试 (`job-resume-match-test.ts`)

测试基于向量相似度的岗位和简历匹配功能。

```bash
npm run test:job-resume-match
```

## 测试流程

1. 初始化RAG服务，连接到Pinecone
2. 从PostgreSQL获取数据（岗位或简历）
3. 生成文本的向量表示并存储到Pinecone
4. 执行向量搜索，测试匹配功能
5. 输出测试结果和统计信息

## 常见问题

- **连接错误**：检查Pinecone API密钥和索引名称/主机是否正确
- **向量生成错误**：检查Embedding服务配置，包括API密钥和模型名称
- **数据获取错误**：确保PostgreSQL数据库连接正常，并且有足够的测试数据

## 数据预览

测试过程会在控制台输出数据预览和处理结果，便于调试和验证。如需保存完整日志，可使用重定向：

```bash
npm run test:job-resume-match > match_test_log.txt
``` 