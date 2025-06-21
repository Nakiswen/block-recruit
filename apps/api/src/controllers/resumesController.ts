import type { Context } from 'koa';
import * as resumesService from '@/services/resumesService';

/**
 * 上传简历 Controller
 * 负责参数校验、错误处理，调用 Service 层
 */
export async function uploadResume(ctx: Context): Promise<void> {
  const { content } = ctx.request.body as { content: string };
  if (!content) {
    ctx.status = 400;
    ctx.body = { error: '简历内容不能为空' };
    return;
  }
  try {
    const userId = ctx.state.user.id;
    const resumeId: string = await resumesService.createResume(userId, content);
    ctx.body = { code: 0, data: { id: resumeId } };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '简历上传失败', detail: (error as Error).message };
  }
}

/**
 * 简历与岗位匹配分析 Controller
 * 负责参数校验、错误处理，调用 Service 层
 */
export async function matchResumeToJob(ctx: Context): Promise<void> {
  const { 
    resumeId, 
    jobId, 
    minMatchScore, 
    location, 
    educationLevel, 
    experienceYears, 
    skills 
  } = ctx.request.body as { 
    resumeId: string; 
    jobId: string;
    minMatchScore?: number | string;
    location?: string;
    educationLevel?: string;
    experienceYears?: number | string;
    skills?: string[];
  };
  
  if (!resumeId || !jobId) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }
  
  try {
    // 构建过滤条件
    const filters = {
      minMatchScore: minMatchScore ? parseFloat(String(minMatchScore)) : undefined,
      location,
      educationLevel,
      experienceYears: experienceYears ? parseInt(String(experienceYears), 10) : undefined,
      skills
    };
    
    // 返回岗位对应的所有简历的匹配列表
    const matchResult = await resumesService.getMatchedResumesForJob(resumeId, jobId, filters);
    ctx.body = { code: 0, data: matchResult };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '匹配分析失败', detail: (error as Error).message };
  }
}

/**
 * 获取简历匹配的岗位列表 Controller
 * 负责参数校验、错误处理，调用 Service 层
 */
export async function getMatchingJobsForResume(ctx: Context): Promise<void> {
  const { resumeId } = ctx.params;
  const { minMatchScore, location, industry, educationLevel, experienceYears } = ctx.query;
  
  if (!resumeId) {
    ctx.status = 400;
    ctx.body = { error: '简历ID不能为空' };
    return;
  }
  
  try {
    const filters = {
      minMatchScore: minMatchScore ? parseFloat(minMatchScore as string) : undefined,
      location: location as string,
      industry: industry as string,
      educationLevel: educationLevel as string,
      experienceYears: experienceYears ? parseInt(experienceYears as string, 10) : undefined
    };
    
    const matchingJobs = await resumesService.getMatchingJobsForResume(resumeId, filters);
    ctx.body = { code: 0, data: matchingJobs };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取匹配岗位失败', detail: (error as Error).message };
  }
} 