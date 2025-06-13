import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import usersRouter from '../routes/users';
// 导入被mock的模块
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

// 创建 Koa 实例并挂载路由
const app = new Koa();
app.use(bodyParser());
app.use(usersRouter.routes()).use(usersRouter.allowedMethods());

// 单元测试用户接口
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

describe('GET /users/me', () => {
  const server = app.callback();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('未提供 token 时应返回 401', async () => {
    const res = await request(server).get('/users/me');
    expect(res.status).toBe(401);
  });

  it('提供有效 token 时应返回用户信息', async () => {
    // 生成测试用 token
    const token = jwt.sign({ id: 'user1', address: '0x123456789' }, JWT_SECRET);
    
    const res = await request(server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'user1');
    expect(res.body).toHaveProperty('address', '0x123456789');
  });
}); 