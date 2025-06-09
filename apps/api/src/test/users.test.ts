import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import usersRouter from '../routes/users';
import jwt from 'jsonwebtoken';

// 创建 Koa 实例并挂载路由
const app = new Koa();
app.use(bodyParser());
app.use(usersRouter.routes()).use(usersRouter.allowedMethods());

// 伪造 JWT token（请根据实际 JWT_SECRET 替换）
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const mockUser = { address: '0x1234567890abcdef' };
const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '1h' });

describe('GET /users/me', () => {
  const server = app.callback();

  it('未携带 token 时应返回 401', async () => {
    const res = await request(server).get('/users/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('携带有效 token 时应返回用户信息', async () => {
    const res = await request(server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    // 这里只能校验接口结构，具体数据需依赖测试数据库
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
}); 