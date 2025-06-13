import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import swaggerJSDoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';
import dotenv from 'dotenv';
// 注意：这里需要添加 .js 扩展名（即使是 .ts 文件）
import authRouter from './routes/auth';

// 加载环境变量
dotenv.config();

const app = new Koa();
const router = new Router();

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
  },
  servers: [
    { url: 'http://localhost:3001', description: '本地开发环境' }
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // 可根据实际路由文件调整
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// 挂载中间件
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());

// 挂载Swagger文档 - 使用 koa2-swagger-ui
app.use(koaSwagger({
  routePrefix: '/docs',
  swaggerOptions: {
    spec: swaggerSpec,
  }
}));

// 全局错误处理
app.on('error', (err, ctx) => {
  console.error('服务异常:', err, ctx);
});

// 启动服务
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Koa API服务已启动，监听端口: ${PORT}`);
  console.log(`Swagger文档地址: http://localhost:${PORT}/docs`);
});