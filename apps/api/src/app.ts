import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { koaSwagger } from 'koa2-swagger-ui';

import applicationsRouter from './routes/applications';
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import nftRouter from './routes/nft';
import resumesRouter from './routes/resumes';
import usersRouter from './routes/users';
import { createSwaggerSpec } from './swagger';

function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGIN || process.env.WEB_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = new Koa();
  const router = new Router();
  const swaggerSpec = createSwaggerSpec();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin: ctx => {
        const requestOrigin = ctx.get('origin');
        if (!requestOrigin) return '*';
        if (allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin)) {
          return requestOrigin;
        }
        return '';
      },
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  app.use(bodyParser());

  router.get('/health', async ctx => {
    ctx.body = {
      status: 'ok',
      message: 'API服务运行正常',
      runtime: process.env.VERCEL ? 'vercel' : 'node',
    };
  });

  router.get('/swagger.json', async ctx => {
    ctx.type = 'application/json';
    ctx.body = swaggerSpec;
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.use(authRouter.routes()).use(authRouter.allowedMethods());
  app.use(applicationsRouter.routes()).use(applicationsRouter.allowedMethods());
  app.use(nftRouter.routes()).use(nftRouter.allowedMethods());
  app.use(resumesRouter.routes()).use(resumesRouter.allowedMethods());
  app.use(jobsRouter.routes()).use(jobsRouter.allowedMethods());
  app.use(usersRouter.routes()).use(usersRouter.allowedMethods());

  app.use(
    koaSwagger({
      routePrefix: '/docs',
      swaggerOptions: {
        spec: swaggerSpec as Record<string, unknown>,
      },
    })
  );

  app.on('error', (err, ctx) => {
    console.error('服务异常:', err, ctx);
  });

  return app;
}
