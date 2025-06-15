import prisma from '@/prisma/web3cv-prisma';
import type { Resume } from '@/prisma/web3cv';

/**
 * 创建简历
 * @param userId 用户ID
 * @param content 简历内容
 * @returns 创建的简历对象
 */
export async function createResume(userId: string, content: string): Promise<Resume> {
  // 调用 Prisma ORM 创建简历
  const resume = await prisma.resume.create({
    data: {
      userId,
      content,
    },
  });
  return resume;
}

/**
 * 根据ID获取简历
 * @param id 简历ID
 * @returns 简历对象或 null
 */
export async function getResumeById(id: string): Promise<Resume | null> {
  const resume = await prisma.resume.findUnique({
    where: { id },
  });
  return resume;
} 