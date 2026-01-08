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
 * @returns 岗位列表和总数
 */
export async function getJobList(
  skip: number,
  take: number,
  keyword?: string,
  manualOnly?: boolean
): Promise<{ jobs: job_posting[]; total: number }> {
  const trimmedKeyword = keyword?.trim();
  const where = {
    ...(manualOnly ? { ffrom: 'manual_upload' } : {}),
    ...(trimmedKeyword
      ? {
          OR: [
            { position_name: { contains: trimmedKeyword } },
            { company: { contains: trimmedKeyword } },
            { location: { contains: trimmedKeyword } },
            { content: { contains: trimmedKeyword } },
            { content2: { contains: trimmedKeyword } },
            { content3: { contains: trimmedKeyword } },
            { content5: { contains: trimmedKeyword } },
            { company_introduction: { contains: trimmedKeyword } },
          ],
        }
      : {}),
  };
  const [jobs, total] = await Promise.all([
    prisma.job_posting.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { create_time: 'desc' },
      skip,
      take,
    }),
    prisma.job_posting.count({ where: Object.keys(where).length ? where : undefined }),
  ]);
  return { jobs, total };
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
