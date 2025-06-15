import type { Context } from 'koa';
import * as usersService from '@/services/usersService';
import type { User } from '@/prisma/web3cv';

/**
 * 查询当前用户信息及其投递记录 Controller
 * 负责参数校验、错误处理，调用 Service 层
 * @returns User 类型，来源于 prisma
 */
export async function getCurrentUser(ctx: Context): Promise<void> {
  const address = ctx.state.user.address as string;
  try {
    const user: User | null = await usersService.getCurrentUser(address);
    ctx.body = { code: 0, data: user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取用户信息失败', detail: (error as Error).message };
  }
} 