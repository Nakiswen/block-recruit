import type { Context, Next } from 'koa';

/**
 * 管理员权限校验中间件
 * 假设 ctx.state.user.role === 'admin' 为管理员
 */
export async function isAdmin(ctx: Context, next: Next) {
  if (ctx.state.user?.role !== 'admin') {
    ctx.status = 403;
    ctx.body = { error: '无管理员权限' };
    return;
  }
  await next();
}
