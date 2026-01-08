import Router from 'koa-router';
import * as jobsController from '@/controllers/jobsController';
import { jwtAuth } from '@/middleware/jwt';

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
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 模糊搜索关键词
 *       - in: query
 *         name: manualOnly
 *         schema:
 *           type: boolean
 *         description: 仅查询手动上传的岗位
 *     responses:
 *       200:
 *         description: 返回岗位列表
 */
router.get('/', jobsController.getJobList);

/**
 * @swagger
 * /jobs/upload:
 *   post:
 *     summary: 上传岗位
 *     tags:
 *       - 岗位
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - positionName
 *               - company
 *             properties:
 *               positionName:
 *                 type: string
 *                 description: 职位名称
 *               company:
 *                 type: string
 *                 description: 公司名称
 *               description:
 *                 type: string
 *                 description: 主要职位描述
 *               responsibilities:
 *                 type: string
 *                 description: 工作职责详情
 *               requirements:
 *                 type: string
 *                 description: 岗位要求详情
 *               benefits:
 *                 type: string
 *                 description: 福利待遇
 *               minSalary:
 *                 type: number
 *                 description: 最低薪资
 *               maxSalary:
 *                 type: number
 *                 description: 最高薪资
 *               location:
 *                 type: string
 *                 description: 工作地点
 *               workTypeName:
 *                 type: string
 *                 description: 工作类型
 *               officeModeName:
 *                 type: string
 *                 description: 办公模式
 *               leverName:
 *                 type: string
 *                 description: 职级名称
 *               companyIntroduction:
 *                 type: string
 *                 description: 公司介绍
 *               companyWebsite:
 *                 type: string
 *                 description: 公司官网
 *               email:
 *                 type: string
 *                 description: 联系邮箱
 *               phone:
 *                 type: string
 *                 description: 联系电话
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 岗位标签
 *     responses:
 *       200:
 *         description: 岗位上传成功
 *       400:
 *         description: 数据验证失败
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
router.post('/upload', jwtAuth, jobsController.uploadJob);

/**
 * @swagger
 * /jobs/manual:
 *   get:
 *     summary: 获取手动上传的岗位列表(调试用)
 *     tags:
 *       - 岗位
 *     responses:
 *       200:
 *         description: 返回手动上传的岗位列表
 */
router.get('/manual', jobsController.getManualJobs);

export default router;
