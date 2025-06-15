import Router from 'koa-router';
import * as applicationsController from '@/controllers/applicationsController';

const router = new Router({ prefix: '/applications' });

/**
 * @swagger
 * /applications/createApplication:
 *   post:
 *     summary: 创建投递记录
 *     tags:
 *       - 投递记录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 用户ID
 *               jobId:
 *                 type: string
 *                 description: 岗位ID
 *     responses:
 *       201:
 *         description: 创建成功，返回投递记录ID
 */
router.post('/createApplication', applicationsController.createApplication);

/**
 * @swagger
 * /applications/getHistoryByUserId:
 *   get:
 *     summary: 查询用户投递历史
 *     tags:
 *       - 投递记录
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 返回投递记录数组
 */
router.get('/getHistoryByUserId', applicationsController.getUserApplications);

/**
 * @swagger
 * /applications/getHistoryByJobId:
 *   get:
 *     summary: 查询岗位投递记录
 *     tags:
 *       - 投递记录
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *         description: 岗位ID
 *     responses:
 *       200:
 *         description: 返回投递记录数组
 */
router.get('/getHistoryByJobId', applicationsController.getJobApplications);

export default router;