import type { Context, Next } from 'koa';

import type { job_posting } from '@/prisma/web3jobs';
import * as jobsService from '@/services/jobsService';
import type { CreateJobDTO } from '@/types/job.dto';

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
    const { jobs, total, cache } = await jobsService.getJobList(page, pageSize);
    ctx.body = { code: 0, data: { jobs, total }, cache };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取岗位列表失败', detail: (error as Error).message };
  }
}

/**
 * 上传岗位 Controller
 * @param ctx Koa上下文
 * @param next Koa next 函数
 */
export async function uploadJob(ctx: Context, next: Next): Promise<void> {
  try {
    const jobData: CreateJobDTO = ctx.request.body as CreateJobDTO;

    // 获取用户信息 (从JWT中间件获取)
    const userId = ctx.state.user?.userId;

    // 调用服务层创建岗位
    const result = await jobsService.createManualJob(jobData, userId);

    ctx.body = {
      code: 0,
      message: '岗位上传成功',
      data: result,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;

    // 区分验证错误和服务器错误
    if (errorMessage.includes('数据验证失败')) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        error: '数据验证失败',
        detail: errorMessage,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        error: '岗位上传失败',
        detail: errorMessage,
      };
    }
  }
}

/**
 * 获取手动上传的岗位列表(调试用)
 * @param ctx Koa上下文
 * @param next Koa next 函数
 */
export async function getManualJobs(ctx: Context, next: Next): Promise<void> {
  try {
    // 直接查询数据库,不使用缓存
    const prisma = (await import('@/prisma/web3jobs-prisma')).default;

    const manualJobs = await prisma.job_posting.findMany({
      where: {
        ffrom: 'manual_upload',
      },
      orderBy: {
        create_time: 'desc',
      },
      take: 20,
    });

    ctx.body = {
      code: 0,
      message: '查询成功',
      data: {
        total: manualJobs.length,
        jobs: manualJobs.map((job: any) => ({
          id: job.topic_id,
          positionName: job.position_name,
          company: job.company,
          createTime: job.create_time ? job.create_time.toString() : null,
          ffrom: job.ffrom,
          status: job.status,
        })),
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      error: '查询失败',
      detail: (error as Error).message,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    };
  }
}
