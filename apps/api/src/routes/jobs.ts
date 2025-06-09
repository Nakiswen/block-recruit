import Router from 'koa-router';
import prisma from '../prisma';
import redis from '../utils/redis';
import type { Context } from 'koa';

const router = new Router({ prefix: '/jobs' });

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 获取岗位列表（带分页和缓存）
 *     tags:
 *       - 岗位
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 返回岗位列表
 */
router.get('/', async (ctx: Context) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = Number(ctx.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;
  const cacheKey = `job_list_${page}_${pageSize}`;

  // 优先查缓存
  const cache = await redis.get(cacheKey);
  if (cache) {
    ctx.body = { code: 0, data: JSON.parse(cache), cache: true };
    return;
  }

  // 查询数据库，建议为 createdAt 字段建索引
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
    select: {
      id: true,
      title: true,
      description: true,
      jobType: true,
      createdAt: true,
      // 只查需要的字段，减少数据量
    },
  });

  await redis.set(cacheKey, JSON.stringify(jobs), 'EX', 60); // 缓存60秒
  ctx.body = { code: 0, data: jobs, cache: false };
});

export default router; 