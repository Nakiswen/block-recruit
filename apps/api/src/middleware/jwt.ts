import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * JWT认证中间件
 * 校验Authorization头中的Bearer token，验证通过后将用户信息挂载到ctx.state.user
 */
export async function jwtAuth(ctx: Context, next: Next) {
  const authHeader = ctx.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { error: '未提供有效的token' };
    return;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    ctx.state.user = payload;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'token无效或已过期' };
  }
} 