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