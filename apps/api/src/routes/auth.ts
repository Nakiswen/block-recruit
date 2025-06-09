import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';

const router = new Router({ prefix: '/auth' });
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 钱包地址登录，签发JWT
 *     tags:
 *       - 认证
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: 钱包地址
 *               signature:
 *                 type: string
 *                 description: 钱包签名
 *               nonce:
 *                 type: string
 *                 description: 随机消息
 *     responses:
 *       200:
 *         description: 登录成功，返回JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: 签名无效
 */
router.post('/login', async (ctx) => {
  // 明确类型，防止类型报错
  const { address, signature, nonce } = ctx.request.body as { address: string; signature: string; nonce: string };
  if (!address || !signature || !nonce) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }
  try {
    // 用ethers.js校验签名
    // nonce为前端生成的随机消息，防止重放攻击
    const recoveredAddress = verifyMessage(nonce, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      ctx.status = 401;
      ctx.body = { error: '签名无效，地址不匹配' };
      return;
    }
    // 签名有效，签发JWT
    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '7d' });
    ctx.body = { token };
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: '签名校验失败', detail: (err as Error).message };
  }
});

export default router; 