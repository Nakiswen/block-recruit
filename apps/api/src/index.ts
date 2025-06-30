import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import swaggerJSDoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// 注意：这里需要添加 .js 扩展名（即使是 .ts 文件）
import authRouter from './routes/auth';
import applicationsRouter from './routes/applications';
import nftRouter from './routes/nft';
import resumesRouter from './routes/resumes';
import jobsRouter from './routes/jobs';
import usersRouter from './routes/users';
import { ragService } from './services/rag/ragService';

// 加载环境变量
dotenv.config();

const app = new Koa();
const router = new Router();

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 基础健康检查路由
router.get('/health', async (ctx) => {
  ctx.body = { status: 'ok', message: 'API服务运行正常' };
});

// Swagger 配置
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BlockRecruit API',
    version: '1.0.0',
    description: '区块链招聘平台后端API文档',
    contact: {
      name: 'BlockRecruit团队',
      email: 'support@blockrecruit.example'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    { url: 'http://localhost:3001', description: '本地开发环境' },
    { url: 'https://api.blockrecruit.example', description: '生产环境' }
  ],
  tags: [
    { name: '认证', description: '用户认证相关接口' },
    { name: '简历', description: '简历上传与处理相关接口' },
    { name: '岗位', description: '区块链岗位相关接口' },
    { name: '用户', description: '用户个人信息相关接口' },
    { name: 'NFT', description: 'NFT证明相关接口' },
    { name: '投递记录', description: '岗位投递记录相关接口' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          address: { type: 'string' },
          nickname: { type: 'string' },
          email: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Job: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          company: { type: 'string' },
          description: { type: 'string' },
          requirements: { type: 'string' },
          location: { type: 'string' },
          salary: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Resume: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          content: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, './routes/*.ts'), 
    path.resolve(__dirname, './routes/*.js')
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// 生成swagger.json文件
const outputPath = path.resolve(__dirname, '../swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');
console.log(`Swagger JSON 文件已生成: ${outputPath}`);

// 挂载中间件
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(applicationsRouter.routes()).use(applicationsRouter.allowedMethods());
app.use(nftRouter.routes()).use(nftRouter.allowedMethods());
app.use(resumesRouter.routes()).use(resumesRouter.allowedMethods());
app.use(jobsRouter.routes()).use(jobsRouter.allowedMethods());
app.use(usersRouter.routes()).use(usersRouter.allowedMethods());

// 添加swagger.json端点
router.get('/swagger.json', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = swaggerSpec;
});

// 挂载Swagger文档 - 使用 koa2-swagger-ui
app.use(koaSwagger({
  routePrefix: '/docs',
  swaggerOptions: {
    spec: swaggerSpec as Record<string, unknown>,
  }
}));

// 全局错误处理
app.on('error', (err, ctx) => {
  console.error('服务异常:', err, ctx);
});

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