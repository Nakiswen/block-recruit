import type { Context, Next } from 'koa';

import type { job_posting } from '@/prisma/web3jobs';
import * as jobsService from '@/services/jobsService';

/**
 * 获取岗位列表 Controller
 * 负责参数校验、错误处理，调用 Service 层
 * @param ctx Koa上下文
 * @param next Koa next 函数
 * @returns jobs 类型为 job_posting[]，来源于 prisma
 */
export async function getJobList(ctx: Context, next: Next): Promise<void> {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  try {
    const { jobs, cache }: { jobs: job_posting[]; cache: boolean } = await jobsService.getJobList(
      page,
      pageSize
    );
    ctx.body = { code: 0, data: jobs, cache };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取岗位列表失败', detail: (error as Error).message };
  }
}
