import Router from 'koa-router';
import { jwtAuth } from '../middleware/jwt';
import * as resumesController from '@/controllers/resumesController';

const router = new Router({ prefix: '/resumes' });

/**
 * @swagger
 * /resumes/upload:
 *   post:
 *     summary: 上传简历（Base64或文本）
 *     tags:
 *       - 简历
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 简历内容（Base64或纯文本）
 *     responses:
 *       200:
 *         description: 上传成功，返回简历ID
 */
router.post('/upload', jwtAuth, resumesController.uploadResume);

/**
 * @swagger
 * /resumes/match:
 *   post:
 *     summary: 简历与岗位的匹配分析
 *     tags:
 *       - 简历
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *               jobId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 匹配分析结果
 */
router.post('/match', jwtAuth, resumesController.matchResumeToJob);

export default router; 