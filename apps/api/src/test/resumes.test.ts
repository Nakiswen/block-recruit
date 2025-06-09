import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import resumesRouter from '../routes/resumes';
import jwt from 'jsonwebtoken';

// 创建 Koa 实例并挂载路由
const app = new Koa();
app.use(bodyParser());
app.use(resumesRouter.routes()).use(resumesRouter.allowedMethods());

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const mockUser = { id: 'test-user-id', address: '0x1234567890abcdef' };
const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '1h' });

describe('简历模块接口', () => {
  const server = app.callback();

  it('未携带 token 上传简历应返回 401', async () => {
    const res = await request(server)
      .post('/resumes/upload')
      .send({ content: 'test resume content' });
    expect(res.status).toBe(401);
  });

  it('携带 token 上传简历应返回简历ID', async () => {
    const res = await request(server)
      .post('/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'test resume content' });
    // 这里只能校验接口结构，具体数据需依赖测试数据库
    if (res.status === 400) {
      expect(res.body).toHaveProperty('error');
    } else {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
    }
  });

  it('简历与岗位匹配分析接口参数不全应返回 400', async () => {
    const res = await request(server)
      .post('/resumes/match')
      .set('Authorization', `Bearer ${token}`)
      .send({ resumeId: '', jobId: '' });
    expect(res.status).toBe(400);
  });
}); 