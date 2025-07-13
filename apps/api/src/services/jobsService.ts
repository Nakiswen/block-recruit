import * as jobsModel from '@/models/jobsModel';
import redis from '@/utils/redis';
import type { job_posting } from '@/prisma/web3jobs';

/**
 * 获取岗位列表 Service
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 岗位列表和缓存标记
 */
export async function getJobList(page: number, pageSize: number): Promise<{ jobs: any[]; cache: boolean }> {
  const skip = (page - 1) * pageSize;
  const cacheKey = `job_list_${page}_${pageSize}`;
  // 优先查缓存
  const cacheData = await redis.get(cacheKey);
  if (cacheData) {
    return { jobs: JSON.parse(cacheData), cache: true };
  }
  // 查询数据库
  const jobsData = await jobsModel.getJobList(skip, pageSize);
  
  // 将数据库字段映射为前端需要的格式
  const jobs = jobsData.map(job => ({
    id: job.topic_id.toString(),
    title: job.position_name,
    company: job.company,
    description: job.content5 || '',
    responsibilities: job.content || '',
    requirements: job.content2 || '',
    benefits: job.content3 || '',
    companyIntroduction: job.company_introduction || '',
    companyWebsite: job.company_website || '',
    location: job.location || '',
    salary: job.min_salary && job.max_salary 
      ? `${job.min_salary}-${job.max_salary}` 
      : job.min_salary 
        ? `${job.min_salary}+` 
        : job.max_salary 
          ? `最高${job.max_salary}` 
          : '',
    createdAt: job.create_time ? new Date(Number(job.create_time) * 1000).toISOString() : new Date().toISOString(),
  }));
  
  await redis.set(cacheKey, JSON.stringify(jobs), 'EX', 60); // 缓存60秒
  return { jobs, cache: false };
} 