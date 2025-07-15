import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import serverless from 'serverless-http';

import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import resumesRouter from './routes/resumes';
import usersRouter from './routes/users';
// 其他路由按需引入

const app = new Koa();
const router = new Router();

router.get('/health', async ctx => {
  ctx.body = { status: 'ok', message: 'API服务运行正常' };
});

// 挂载所有路由
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(usersRouter.routes()).use(usersRouter.allowedMethods());
app.use(jobsRouter.routes()).use(jobsRouter.allowedMethods());
app.use(resumesRouter.routes()).use(resumesRouter.allowedMethods());
// 其他路由同理

// 导出 serverless handler
export const handler = serverless(app);
