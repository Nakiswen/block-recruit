import prisma from '@/prisma/web3cv-prisma';
import type { User } from '@/prisma/web3cv';

/**
 * 获取用户及其投递记录和岗位信息
 * @param address 用户钱包地址
 * @returns 用户对象及其投递记录，若不存在返回 null
 */
export async function getUserWithApplications(address: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { address },
    include: {
      applications: {
        include: {
          job: true,
        },
      },
    },
  });
  return user;
}

/**
 * 根据钱包地址查找用户
 * @param address 用户钱包地址
 * @returns 用户对象，若不存在返回 null
 */
export async function findUserByAddress(address: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { address }
  });
}

/**
 * 创建新用户
 * @param address 用户钱包地址
 * @param nickname 可选用户昵称
 * @returns 创建的用户对象
 */
export async function createUser(address: string, nickname?: string): Promise<User> {
  return prisma.user.create({
    data: {
      address,
      nickname
    }
  });
} 