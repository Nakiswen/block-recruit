import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jobsRouter from '../routes/jobs';
import redis from '../utils/redis';
import { jest, describe, beforeAll, afterAll, it, expect } from '@jest/globals';

// 创建 Koa 实例并挂载路由
const app = new Koa();
app.use(bodyParser());
app.use(jobsRouter.routes()).use(jobsRouter.allowedMethods());

// Mock Redis
jest.mock('../utils/redis', () => ({
  // @ts-ignore -- jest mock
  get: jest.fn(),
  // @ts-ignore -- jest mock
  set: jest.fn(),
  // @ts-ignore -- jest mock
  flushall: jest.fn(),
  // @ts-ignore -- jest mock
  quit: jest.fn()
}));

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
    // 模拟 Redis get 返回 null (未命中缓存)
    jest.spyOn(redis, 'get').mockResolvedValue(null);
    
    const res = await request(server).get('/jobs?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.cache).toBe(false);
  });

  it('应返回岗位列表（再次请求，命中缓存）', async () => {
    // 模拟 Redis 命中缓存
    jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify([
      { id: 'cached1', title: '缓存岗位1' },
      { id: 'cached2', title: '缓存岗位2' }
    ]));
    
    const res = await request(server).get('/jobs?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.cache).toBe(true);
  });
}); 