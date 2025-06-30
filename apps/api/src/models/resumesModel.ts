import prisma from '@/prisma/web3cv-prisma';
import type { Resume } from '@/prisma/web3cv';

/**
 * 创建简历
 * @param userId 用户ID
 * @param content 简历内容
 * @param fileName 文件名 (可选)
 * @param fileType 文件类型 (可选)
 * @param fileSize 文件大小 (可选)
 * @returns 创建的简历对象
 */
export async function createResume(
  userId: string, 
  content: string,
  fileName?: string,
  fileType?: string,
  fileSize?: number
): Promise<Resume> {
  // 调用 Prisma ORM 创建简历，只存储基本信息
  const resume = await prisma.resume.create({
    data: {
      userId,
      content,
      filename: fileName,
      filetype: fileType,
      filesize: fileSize,
      status: 'pending', // 初始状态为待处理
      title: fileName ? fileName.replace(/\.[^/.]+$/, '') : undefined, // 从文件名提取标题
    },
  });
  return resume;
}

/**
 * 更新简历状态
 * @param id 简历ID
 * @param status 状态
 * @returns 更新后的简历对象
 */
export async function updateResumeStatus(id: string, status: string): Promise<Resume> {
  return await prisma.resume.update({
    where: { id },
    data: { status }
  });
}

/**
 * 更新简历结构化数据
 * @param id 简历ID
 * @param parsedData 解析后的结构化数据
 * @returns 更新后的简历对象
 */
export async function updateResumeParsedData(id: string, parsedData: any): Promise<Resume> {
  return await prisma.resume.update({
    where: { id },
    data: { 
      parsedData,
      status: 'parsed' // 更改状态为已解析
    }
  });
}

/**
 * 更新简历向量ID
 * @param id 简历ID
 * @param vectorId 向量ID
 * @returns 更新后的简历对象
 */
export async function updateResumeVectorId(id: string, vectorId: string): Promise<Resume> {
  return await prisma.resume.update({
    where: { id },
    data: { 
      vectorId,
      status: 'vectorized' // 更改状态为已向量化
    }
  });
}

/**
 * 根据状态获取简历列表
 * @param status 状态
 * @param limit 限制数量
 * @returns 指定状态的简历列表
 */
export async function getResumesByStatus(status: string, limit: number = 10): Promise<Resume[]> {
  return await prisma.resume.findMany({
    where: { status },
    orderBy: { createdAt: 'asc' },
    take: limit
  });
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

/**
 * 根据用户ID获取该用户的所有简历
 * @param userId 用户ID
 * @returns 简历列表，按创建时间倒序排列
 */
export async function getUserResumes(userId: string): Promise<Resume[]> {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return resumes;
}

/**
 * 通用更新简历方法
 * @param id 简历ID
 * @param data 要更新的数据
 * @returns 更新后的简历对象
 */
export async function updateResume(id: string, data: any): Promise<Resume> {
  return await prisma.resume.update({
    where: { id },
    data
  });
} 