import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jobsRouter from '../routes/jobs';
import redis from '../utils/redis';

// 创建 Koa 实例并挂载路由
const app = new Koa();
app.use(bodyParser());
app.use(jobsRouter.routes()).use(jobsRouter.allowedMethods());

// 单元测试岗位列表接口

describe('GET /jobs', () => {
  const server = app.callback();

  beforeAll(async () => {
    // 保证测试前缓存被清空
    await redis.flushall();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('应返回岗位列表（首次请求，未命中缓存）', async () => {
    const res = await request(server).get('/jobs?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.cache).toBe(false);
  });

  it('应返回岗位列表（再次请求，命中缓存）', async () => {
    const res = await request(server).get('/jobs?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.cache).toBe(true);
  });
}); 