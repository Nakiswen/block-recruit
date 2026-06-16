import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { createApp } from './app';
import { ragService } from './services/rag/ragService';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量：先加载根目录的 .env，再加载本地的 .env.local（会覆盖根目录的同名变量）
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = createApp();

// 初始化RAG服务和Pinecone客户端
async function initServices() {
  try {
    console.log('正在初始化RAG服务和Pinecone客户端...');
    await ragService.init();
    console.log('RAG服务和Pinecone客户端初始化成功');
  } catch (error) {
    console.error('RAG服务初始化失败:', error);
    console.warn('应用将在没有向量搜索功能的情况下继续运行');
  }
}

// 启动服务
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Koa API服务已启动，监听端口: ${PORT}`);
  console.log(`Swagger文档地址: http://localhost:${PORT}/docs`);
  console.log(`Swagger JSON地址: http://localhost:${PORT}/swagger.json`);

  // 初始化服务
  initServices();
});
