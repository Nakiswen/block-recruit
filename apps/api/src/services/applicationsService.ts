import * as applicationsModel from '@/models/applicationsModel';
import type { Application } from '@/prisma/web3cv';

/**
 * 创建投递记录 Service
 * @param userId 用户ID
 * @param jobId 岗位ID
 * @returns 投递记录ID
 */
export async function createApplication(userId: string, jobId: string): Promise<string> {
  try {
    const application = await applicationsModel.createApplication(userId, jobId);
    return application.id;
  } catch (error) {
    // 错误处理：如唯一性约束、数据库异常等
    throw new Error('创建投递记录失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 查询用户投递历史 Service
 * @param userId 用户ID
 * @returns 投递记录数组
 */
export async function getUserApplications(userId: string): Promise<Application[]> {
  try {
    return await applicationsModel.getApplicationsByUserId(userId);
  } catch (error) {
    throw new Error('查询用户投递历史失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 查询岗位的所有投递记录 Service
 * @param jobId 岗位ID
 * @returns 投递记录数组
 */
export async function getJobApplications(jobId: string): Promise<Application[]> {
  try {
    return await applicationsModel.getApplicationsByJobId(jobId);
  } catch (error) {
    throw new Error('查询岗位投递记录失败: ' + (error instanceof Error ? error.message : String(error)));
  }
} 