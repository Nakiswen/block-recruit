import type { Context } from 'koa';

import type { Application } from '@/prisma/web3cv';
import * as applicationsService from '@/services/applicationsService';

/**
 * 创建投递记录 Controller
 * @param ctx Koa 上下文
 */
export async function createApplication(ctx: Context): Promise<void> {
  const { userId, jobId } = ctx.request.body as { userId: string; jobId: string };
  if (!userId || !jobId) {
    ctx.status = 400;
    ctx.body = { error: 'userId 和 jobId 必填' };
    return;
  }
  try {
    const id: string = await applicationsService.createApplication(userId, jobId);
    ctx.status = 201;
    ctx.body = { id };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * 查询用户投递历史 Controller
 * @param ctx Koa 上下文
 */
export async function getUserApplications(ctx: Context): Promise<void> {
  const { userId } = ctx.query as { userId?: string };
  if (!userId) {
    ctx.status = 400;
    ctx.body = { error: 'userId 必填' };
    return;
  }
  try {
    const applications: Application[] = await applicationsService.getUserApplications(userId);
    ctx.body = { applications };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * 查询岗位投递记录 Controller
 * @param ctx Koa 上下文
 */
export async function getJobApplications(ctx: Context): Promise<void> {
  const { jobId } = ctx.query as { jobId?: string };
  if (!jobId) {
    ctx.status = 400;
    ctx.body = { error: 'jobId 必填' };
    return;
  }
  try {
    const applications: Application[] = await applicationsService.getJobApplications(jobId);
    ctx.body = { applications };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : String(error) };
  }
}
