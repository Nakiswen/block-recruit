import Router from 'koa-router';
import * as nftController from '@/controllers/nftController';

const router = new Router({ prefix: '/nft' });

/**
 * @swagger
 * /nft/user:
 *   get:
 *     summary: 查询用户 NFT 证明
 *     tags:
 *       - NFT
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 返回 NFT 证明数组
 */
router.get('/user', nftController.getUserNfts);

/**
 * @swagger
 * /nft/achievement:
 *   post:
 *     summary: 记录链上成就
 *     tags:
 *       - NFT
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
 *               type:
 *                 type: string
 *                 description: 成就类型
 *               data:
 *                 type: string
 *                 description: 成就数据
 *     responses:
 *       201:
 *         description: 创建成功，返回 NFT 证明ID
 */
router.post('/achievement', nftController.recordNftAchievement);

/**
 * @swagger
 * /nft/blockchain:
 *   post:
 *     summary: 链上交互接口
 *     tags:
 *       - NFT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 交互参数
 *     responses:
 *       200:
 *         description: 交互结果
 */
router.post('/blockchain', nftController.blockchainInteraction);

export default router; 