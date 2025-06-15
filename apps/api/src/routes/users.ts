import Router from 'koa-router';
import { jwtAuth } from '../middleware/jwt';
import * as usersController from '@/controllers/usersController';

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
router.get('/me', jwtAuth, usersController.getCurrentUser);

export default router; 