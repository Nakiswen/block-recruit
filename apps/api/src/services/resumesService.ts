import * as resumesModel from '@/models/resumesModel';
import * as jobsModel from '@/models/jobsModel';
import type { Resume } from '@/prisma/web3cv';
import type { job_posting } from '@/prisma/web3jobs';

/**
 * 创建简历 Service
 * @param userId 用户ID
 * @param content 简历内容
 * @returns 简历ID
 */
export async function createResume(userId: string, content: string): Promise<string> {
  // 可扩展：集成简历解析逻辑
  const resume = await resumesModel.createResume(userId, content);
  return resume.id;
}

/**
 * 简历与岗位匹配分析 Service
 * @param resumeId 简历ID
 * @param jobId 岗位ID
 * @returns 匹配分析结果
 */
export async function matchResumeToJob(
  resumeId: string,
  jobId: string
): Promise<{ matchScore: number; message: string }> {
  const resume: Resume | null = await resumesModel.getResumeById(resumeId);
  const job: job_posting | null = await jobsModel.getJobById(jobId);
  if (!resume || !job) {
    throw new Error('简历或岗位不存在');
  }
  // TODO: 集成实际的匹配分析算法
  const matchScore = Math.random() * 100;
  return { matchScore, message: '匹配分析仅为示例' };
} 