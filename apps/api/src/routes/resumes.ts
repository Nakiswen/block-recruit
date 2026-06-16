import Router from 'koa-router';
import multer from '@koa/multer';
import { jwtAuth } from '../middleware/jwt';
import * as resumesController from '@/controllers/resumesController';

const router = new Router({ prefix: '/resumes' });
const defaultUploadLimit = process.env.VERCEL ? 4 * 1024 * 1024 : 10 * 1024 * 1024;
const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || defaultUploadLimit);

// 配置 Multer 用于文件上传
const upload = multer({
  storage: multer.memoryStorage(), // 将文件保存在内存中
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'text/plain',
      'text/markdown',
      'text/x-markdown',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  },
  limits: { fileSize: maxUploadBytes },
});

/**
 * @swagger
 * /resumes/upload:
 *   post:
 *     summary: 上传简历文件(pdf, docx, png, jpg)
 *     tags:
 *       - 简历
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: 简历文件
 *     responses:
 *       202:
 *         description: 上传成功，返回简历ID，后台异步处理
 *       400:
 *         description: 文件格式错误或内容无效
 *       401:
 *         description: 用户未授权
 */
router.post('/upload', jwtAuth, upload.single('resume'), resumesController.uploadResume);

/**
 * @swagger
 * /resumes/match:
 *   post:
 *     summary: 当前用户简历与推荐岗位的匹配分析
 *     tags:
 *       - 简历
 *     responses:
 *       200:
 *         description: 匹配分析完成，返回匹配的岗位列表数据
 *       401:
 *         description: 用户未授权
 *       404:
 *         description: 用户没有简历或没有推荐岗位
 */
router.post('/match', jwtAuth, resumesController.matchResumeToJob);

/**
 * @swagger
 * /resumes/{resumeId}/matching-jobs:
 *   get:
 *     summary: 获取简历匹配的岗位列表
 *     tags:
 *       - 简历
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: minMatchScore
 *         schema:
 *           type: number
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *       - in: query
 *         name: educationLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: experienceYears
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 返回匹配的岗位列表数据
 */
router.get('/:resumeId/matching-jobs', jwtAuth, resumesController.getMatchingJobsForResume);

/**
 * @swagger
 * /resumes/{resumeId}/progress:
 *   get:
 *     summary: 获取简历处理进度
 *     tags:
 *       - 简历
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 返回处理进度和结果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: number
 *                   description: 处理进度百分比(0-100)
 *                 status:
 *                   type: string
 *                   enum: [processing, done, failed]
 *                   description: 处理状态
 *                 jobs:
 *                   type: array
 *                   description: 匹配的岗位列表(仅在status为done时返回)
 *       404:
 *         description: 简历不存在
 */
router.get('/:resumeId/progress', jwtAuth, resumesController.getResumeProgress);

export default router;
