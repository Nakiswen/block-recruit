import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { findUserByAddress } from '../models/usersModel.js';
import prisma from '@/prisma/web3cv-prisma.js';
import { getJwtSecret } from '@/config/auth.js';

// 定义JWT载荷类型
interface JwtPayload {
  address?: string;
  userId?: string;
  email?: string;
  googleId?: string;
  [key: string]: any;
}

/**
 * JWT认证中间件
 * 同时支持钱包认证(JWT token)和Google OAuth认证(user ID/email)
 * 校验Authorization头中的Bearer token,验证通过后将用户信息挂载到ctx.state.user
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
  console.log('🔍 [JWT中间件] 接收到的 token:', token);
  console.log('🔍 [JWT中间件] Token 长度:', token.length);
  console.log('🔍 [JWT中间件] Token 是否包含 @:', token.includes('@'));

  try {
    // 尝试作为JWT token验证(钱包登录)
    try {
      const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

      // 如果是有效的JWT token，按原逻辑处理
      if (payload.address) {
        ctx.state.user = payload;

        // 如果JWT中没有userId但有address，尝试从数据库获取userId
        if (!payload.userId && payload.address) {
          try {
            const user = await findUserByAddress(payload.address);
            if (user) {
              ctx.state.user.userId = user.id;
              console.log(`已从数据库补充用户ID: ${user.id}`);
            } else {
              console.warn(`无法找到地址为 ${payload.address} 的用户`);
            }
          } catch (dbError) {
            console.error('查询用户时出错:', dbError);
          }
        }

        console.log(`钱包认证成功: ${payload.address}`);
        await next();
        return;
      }
    } catch (jwtError) {
      // JWT验证失败，尝试作为Google OAuth token处理
      console.log('不是有效的JWT token，尝试作为Google OAuth ID处理');
    }

    // 如果不是有效的JWT，尝试作为Google OAuth的用户ID或email处理
    // token 可能是 session.user.id 或 session.user.email
    let user = null;

    // 先尝试作为用户ID查询
    try {
      console.log('🔍 [JWT中间件] 尝试按 ID 查询用户:', token);
      user = await prisma.user.findUnique({
        where: { id: token },
      });
      console.log('🔍 [JWT中间件] 按 ID 查询结果:', user ? '找到用户' : '未找到');
    } catch (err) {
      console.log('🔍 [JWT中间件] 按ID查询失败，尝试按email查询', err);
    }

    // 如果按ID没找到，尝试作为email查询
    if (!user) {
      try {
        console.log('🔍 [JWT中间件] 尝试按 email 查询用户:', token);
        user = await prisma.user.findUnique({
          where: { email: token },
        });
        console.log('🔍 [JWT中间件] 按 email 查询结果:', user ? '找到用户' : '未找到');
      } catch (err) {
        console.log('🔍 [JWT中间件] 按email查询也失败', err);
      }
    }

    if (user) {
      // Google OAuth认证成功
      ctx.state.user = {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      };
      console.log(`Google OAuth认证成功: ${user.email}`);
      await next();
      return;
    }

    // 如果是email格式(包含@)，说明是Google登录但用户不存在，自动创建用户
    if (token.includes('@')) {
      try {
        console.log(`Google用户不存在，自动创建: ${token}`);
        const newUser = await prisma.user.create({
          data: {
            email: token,
            nickname: token.split('@')[0], // 使用email前缀作为昵称
          },
        });

        ctx.state.user = {
          userId: newUser.id,
          email: newUser.email,
          nickname: newUser.nickname,
        };
        console.log(`已创建新Google用户: ${newUser.email} (ID: ${newUser.id})`);
        await next();
        return;
      } catch (createError) {
        console.error('创建Google用户失败:', createError);
        ctx.status = 500;
        ctx.body = { error: '创建用户失败' };
        return;
      }
    }

    // 两种认证方式都失败
    console.error('认证失败: token既不是有效的JWT，也无法匹配到用户');
    ctx.status = 401;
    ctx.body = { error: 'token无效' };
  } catch (err) {
    // 详细的错误处理
    if (err instanceof jwt.JsonWebTokenError) {
      console.error('JWT验证失败:', err.message);
      ctx.status = 401;
      ctx.body = { error: 'token无效' };
    } else if (err instanceof jwt.TokenExpiredError) {
      console.error('JWT已过期:', err.message);
      ctx.status = 401;
      ctx.body = { error: 'token已过期，请重新登录' };
    } else if (err instanceof jwt.NotBeforeError) {
      console.error('JWT尚未生效:', err.message);
      ctx.status = 401;
      ctx.body = { error: 'token尚未生效' };
    } else {
      console.error('JWT验证过程中发生未知错误:', err);
      ctx.status = 401;
      ctx.body = { error: 'token验证失败' };
    }
  }
}
