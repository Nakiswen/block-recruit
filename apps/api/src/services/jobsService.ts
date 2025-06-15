import * as jobsModel from '@/models/jobsModel';
import redis from '@/utils/redis';
import type { job_posting } from '@/prisma/web3jobs';

/**
 * 获取岗位列表 Service
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 岗位列表和缓存标记
 */
export async function getJobList(page: number, pageSize: number): Promise<{ jobs: job_posting[]; cache: boolean }> {
  const skip = (page - 1) * pageSize;
  const cacheKey = `job_list_${page}_${pageSize}`;
  // 优先查缓存
  const cacheData = await redis.get(cacheKey);
  if (cacheData) {
    return { jobs: JSON.parse(cacheData), cache: true };
  }
  // 查询数据库
  const jobs = await jobsModel.getJobList(skip, pageSize);
  await redis.set(cacheKey, JSON.stringify(jobs), 'EX', 60); // 缓存60秒
  return { jobs, cache: false };
} 