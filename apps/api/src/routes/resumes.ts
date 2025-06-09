import Router from 'koa-router';
import prisma from '../prisma';
import { jwtAuth } from '../middleware/jwt';
import type { Context } from 'koa';

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
router.post('/upload', jwtAuth, async (ctx: Context) => {
  const { content } = ctx.request.body as { content: string };
  if (!content) {
    ctx.status = 400;
    ctx.body = { error: '简历内容不能为空' };
    return;
  }
  // 这里可集成简历解析逻辑，暂存原始内容
  const resume = await prisma.resume.create({
    data: {
      userId: ctx.state.user.id,
      content,
      // parsedContent: {}, // 可扩展：解析后的结构化内容
    },
  });
  ctx.body = { code: 0, data: { id: resume.id } };
});

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
router.post('/match', jwtAuth, async (ctx: Context) => {
  const { resumeId, jobId } = ctx.request.body as { resumeId: string; jobId: string };
  if (!resumeId || !jobId) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }

  // 查询简历和岗位
  const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!resume || !job) {
    ctx.status = 404;
    ctx.body = { error: '简历或岗位不存在' };
    return;
  }

  //  TODO: 可集成实际的匹配分析算法，暂返回简单示例
  const matchScore = Math.random() * 100;
  ctx.body = { code: 0, data: { matchScore, message: '匹配分析仅为示例' } };
});

export default router; 