import * as resumesModel from '@/models/resumesModel';
import * as jobsModel from '@/models/jobsModel';
import type { Resume } from '@/prisma/web3cv';
import type { job_posting } from '@/prisma/web3jobs';
import { matchingService } from './matchingService';

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
 * @param filters 过滤条件
 * @returns 匹配分析结果
 */
export async function getMatchedResumesForJob(
  resumeId: string,
  jobId: string,
  filters: {
    minMatchScore?: number,
    location?: string,
    educationLevel?: string,
    experienceYears?: number,
    skills?: string[],
  } = {}
): Promise<ReturnType<typeof matchingService.getMatchedResumesForJob>> {
  // 校验简历和岗位是否存在
  const resume: Resume | null = await resumesModel.getResumeById(resumeId);
  const job: job_posting | null = await jobsModel.getJobById(jobId);
  if (!resume || !job) {
    throw new Error('简历或岗位不存在');
  }
  // 直接返回岗位对应的所有简历的匹配列表，传入过滤条件
  return await matchingService.getMatchedResumesForJob(jobId, filters);
}

/**
 * 获取简历匹配的岗位列表 Service
 * @param resumeId 简历ID
 * @param filters 过滤条件
 * @returns 匹配的岗位列表
 */
export async function getMatchedJobsForResume(
  resumeId: string,
  filters: {
    minMatchScore?: number,
    location?: string,
    industry?: string,
    educationLevel?: string,
    experienceYears?: number,
  } = {}
): Promise<ReturnType<typeof matchingService.getMatchedJobsForResume>> {
  // 检查简历是否存在
  const resume: Resume | null = await resumesModel.getResumeById(resumeId);
  if (!resume) {
    throw new Error('简历不存在');
  }
  
  // 调用matchingService的matchJobsForResume方法获取匹配的岗位列表
  return await matchingService.getMatchedJobsForResume(resumeId, filters);
} 