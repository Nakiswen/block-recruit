import Router from 'koa-router';
import * as jobsController from '@/controllers/jobsController';

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
router.get('/', jobsController.getJobList);

export default router; 