import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { findUserByAddress } from '../models/usersModel';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 定义JWT载荷类型
interface JwtPayload {
  address: string;
  userId?: string;
  [key: string]: any;
}

/**
 * JWT认证中间件
 * 校验Authorization头中的Bearer token，验证通过后将用户信息挂载到ctx.state.user
 */
export async function jwtAuth(ctx: Context, next: Next) {
  // 检查Authorization头
  const authHeader = ctx.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { error: '未提供有效的token' };
    return;
  }
  
  // 提取token
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // 验证token
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("JWT验证成功，载荷:", payload);
    
    // 确保payload包含address
    if (!payload.address) {
      console.error("JWT中缺少address字段");
      ctx.status = 401;
      ctx.body = { error: 'token无效，缺少必要信息' };
      return;
    }
    
    // 将用户信息挂载到ctx.state.user
    ctx.state.user = payload;
    
    // 如果JWT中没有userId但有address，尝试从数据库获取userId
    if (!payload.userId && payload.address) {
      try {
        const user = await findUserByAddress(payload.address);
        if (user) {
          // 将userId添加到ctx.state.user中
          ctx.state.user.userId = user.id;
          console.log(`已从数据库补充用户ID: ${user.id}`);
        } else {
          console.warn(`无法找到地址为 ${payload.address} 的用户`);
        }
      } catch (dbError) {
        console.error("查询用户时出错:", dbError);
        // 不中断请求，继续执行，但记录错误
      }
    }
    
    // 记录认证成功的用户信息
    const userId = ctx.state.user.userId || '未知';
    const address = ctx.state.user.address;
    console.log(`已授权用户: ID=${userId}, 地址=${address}`);
    
    await next();
  } catch (err) {
    // 详细的错误处理
    if (err instanceof jwt.JsonWebTokenError) {
      console.error("JWT验证失败:", err.message);
      ctx.status = 401;
      ctx.body = { error: 'token无效' };
    } else if (err instanceof jwt.TokenExpiredError) {
      console.error("JWT已过期:", err.message);
      ctx.status = 401;
      ctx.body = { error: 'token已过期，请重新登录' };
    } else if (err instanceof jwt.NotBeforeError) {
      console.error("JWT尚未生效:", err.message);
      ctx.status = 401;
      ctx.body = { error: 'token尚未生效' };
    } else {
      console.error("JWT验证过程中发生未知错误:", err);
      ctx.status = 401;
      ctx.body = { error: 'token验证失败' };
    }
  }
}
