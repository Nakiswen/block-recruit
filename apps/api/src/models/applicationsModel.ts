import prisma from '@/prisma/web3cv-prisma';
import type { Application } from '@/prisma/web3cv';

/**
 * 创建投递记录
 * @param userId 用户ID
 * @param jobId 岗位ID
 * @param status 投递状态，默认 pending
 * @returns 投递记录对象
 */
export async function createApplication(userId: string, jobId: string, status: string = 'pending'): Promise<Application> {
  try {
    const application = await prisma.application.create({
      data: { userId, jobId, status },
    });
    return application;
  } catch (error) {
    throw new Error('数据库创建投递记录失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 按用户ID查询投递记录
 * @param userId 用户ID
 * @returns 投递记录数组
 */
export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  try {
    return await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    throw new Error('数据库查询用户投递历史失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 按岗位ID查询投递记录
 * @param jobId 岗位ID
 * @returns 投递记录数组
 */
export async function getApplicationsByJobId(jobId: string): Promise<Application[]> {
  try {
    return await prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    throw new Error('数据库查询岗位投递记录失败: ' + (error instanceof Error ? error.message : String(error)));
  }
} 