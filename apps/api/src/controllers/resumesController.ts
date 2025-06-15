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
  const { resumeId, jobId } = ctx.request.body as { resumeId: string; jobId: string };
  if (!resumeId || !jobId) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }
  try {
    const result: { matchScore: number; message: string } = await resumesService.matchResumeToJob(resumeId, jobId);
    ctx.body = { code: 0, data: result };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '匹配分析失败', detail: (error as Error).message };
  }
} 