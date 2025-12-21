import prisma from '@/prisma/web3jobs-prisma';
import type { job_posting } from '@/prisma/web3jobs';

/**
 * 根据ID获取岗位
 * @param topicId 岗位ID
 * @returns 岗位对象或 null
 */
export async function getJobById(topicId: string | number): Promise<job_posting | null> {
  const job = await prisma.job_posting.findUnique({
    where: { topic_id: topicId },
  });
  return job;
}

/**
 * 分页获取岗位列表
 * @param skip 跳过数量
 * @param take 获取数量
 * @returns 岗位列表
 */
export async function getJobList(skip: number, take: number): Promise<job_posting[]> {
  const jobs = await prisma.job_posting.findMany({
    orderBy: { create_time: 'desc' },
    skip,
    take,
  });
  return jobs;
}

/**
 * 创建岗位
 * @param data 岗位数据
 * @returns 创建的岗位对象
 */
export async function createJobPosting(data: {
  topic_id: string;
  position_name: string;
  company: string;
  content?: string;
  content2?: string;
  content3?: string;
  content5?: string;
  min_salary?: number;
  max_salary?: number;
  location?: string;
  work_type_name?: string;
  office_mode_name?: string;
  lever_name?: string;
  company_introduction?: string;
  company_website?: string;
  company_logo?: string;
  company_size_name?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  telegram?: string;
  create_time: bigint;
  ffrom: string;
  status: number;
}): Promise<job_posting> {
  const job = await prisma.job_posting.create({
    data,
  });
  return job;
}
