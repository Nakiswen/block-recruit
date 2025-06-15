import * as usersModel from '@/models/usersModel';
import type { User } from '@/prisma/web3cv';

/**
 * 查询当前用户信息及其投递记录 Service
 * @param address 用户钱包地址
 * @returns 用户信息及投递记录
 */
export async function getCurrentUser(address: string): Promise<User | null> {
  const user = await usersModel.getUserWithApplications(address);
  return user;
} 