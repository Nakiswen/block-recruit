import Router from 'koa-router';
import prisma from '../prisma/web3cv';
import { jwtAuth } from '../middleware/jwt';
import type { Context } from 'koa';

const router = new Router({ prefix: '/users' });

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 查询当前用户信息及其投递记录
 *     tags:
 *       - 用户
 *     responses:
 *       200:
 *         description: 返回用户信息
 */
router.get('/me', jwtAuth, async (ctx: Context) => {
  const address = ctx.state.user.address as string;
  // 连接查询：用户及其投递记录和岗位信息
  const user = await prisma.user.findUnique({
    where: { address },
    include: {
      applications: {
        include: {
          job: true,
        },
      },
    },
  });
  ctx.body = { code: 0, data: user };
});

export default router; 