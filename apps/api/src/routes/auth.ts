import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';
import crypto from 'crypto';
// 临时禁用Redis，使用内存存储
// import redis from '../utils/redis';
import { findUserByAddress, createUser } from '../models/usersModel';

const router = new Router({ prefix: '/auth' });
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// 使用内存Map替代Redis存储nonce
const nonceStore = new Map<string, {nonce: string, expiry: number}>();

// 生成标准化的签名消息
function generateSignMessage(address: string, nonce: string): string {
  return `欢迎登录BlockRecruit!\n\n请签名以验证您是地址 ${address} 的所有者\n\n验证码: ${nonce}\n\n此签名不会花费任何燃料费`;
}

// 存储nonce到内存Map，设置过期时间（默认15分钟）
async function storeNonce(address: string, nonce: string, expireSeconds: number = 15 * 60): Promise<void> {
  const key = address.toLowerCase();
  const expiry = Date.now() + expireSeconds * 1000;
  nonceStore.set(key, { nonce, expiry });
  console.log(`存储nonce成功: ${key} -> ${nonce}, 过期时间: ${new Date(expiry).toLocaleString()}`);
}

// 获取存储的nonce
async function getNonce(address: string): Promise<string | null> {
  const key = address.toLowerCase();
  const storedValue = nonceStore.get(key);
  
  // 检查是否存在以及是否过期
  if (!storedValue) {
    console.log(`Nonce不存在: ${key}`);
    return null;
  }
  
  if (storedValue.expiry < Date.now()) {
    console.log(`Nonce已过期: ${key}`);
    nonceStore.delete(key);
    return null;
  }
  
  console.log(`获取nonce成功: ${key} -> ${storedValue.nonce}`);
  return storedValue.nonce;
}

// 验证后使nonce失效
async function invalidateNonce(address: string): Promise<void> {
  const key = address.toLowerCase();
  nonceStore.delete(key);
  console.log(`使nonce失效: ${key}`);
}

/**
 * @swagger
 * /auth/challenge:
 *   get:
 *     summary: 获取登录挑战消息
 *     tags:
 *       - 认证
 *     parameters:
 *       - name: address
 *         in: query
 *         required: true
 *         description: 钱包地址
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 返回需要签名的挑战消息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 需要签名的消息
 *                 nonce:
 *                   type: string
 *                   description: 随机挑战码
 */
router.get('/challenge', async (ctx) => {
  const address = ctx.query.address as string;
  
  if (!address) {
    ctx.status = 400;
    ctx.body = { error: '缺少钱包地址参数' };
    return;
  }

  try {
    // 生成随机nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // 存储nonce，15分钟过期
    await storeNonce(address, nonce);
    
    // 生成标准签名消息
    const message = generateSignMessage(address, nonce);
    
    ctx.body = {
      message,
      nonce
    };
  } catch (err) {
    console.error('生成挑战消息失败:', err);
    ctx.status = 500;
    ctx.body = { error: '生成挑战消息失败', detail: (err as Error).message };
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 验证签名并登录
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
 *                 description: 随机挑战码
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
  const { address, signature, nonce } = ctx.request.body as { address: string; signature: string; nonce: string };
  
  if (!address || !signature || !nonce) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }
  
  try {
    console.log(`验证登录: 地址=${address}, nonce=${nonce}`);
    
    // 验证nonce是否有效
    const storedNonce = await getNonce(address);
    if (!storedNonce || storedNonce !== nonce) {
      ctx.status = 401;
      ctx.body = { error: 'nonce无效或已过期，请重新获取挑战' };
      return;
    }

    // 重建签名消息
    const message = generateSignMessage(address, nonce);
    
    // 验证签名
    const recoveredAddress = verifyMessage(message, signature);
    console.log('恢复的地址:', recoveredAddress);
    console.log('提供的地址:', address);
    
    // 验证地址是否匹配
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      ctx.status = 401;
      ctx.body = { error: '签名无效，地址不匹配' };
      return;
    }
    
    // 使用过的nonce立即失效，防止重放攻击
    await invalidateNonce(address);
    
    // 查询用户是否存在，不存在则创建
    let user = await findUserByAddress(address);
    
    if (!user) {
      console.log(`用户${address}不存在，正在创建新用户...`);
      user = await createUser(address);
      console.log(`创建用户成功, id=${user.id}`);
    } else {
      console.log(`用户${address}已存在, id=${user.id}`);
    }
    
    // 签名有效，签发JWT，包含用户ID
    const token = jwt.sign({ 
      address, 
      userId: user.id 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    ctx.body = { token, userId: user.id };
    
  } catch (err) {
    console.error('签名验证失败:', err);
    ctx.status = 401;
    ctx.body = { error: '签名校验失败', detail: (err as Error).message };
  }
});

/**
 * @swagger
 * /auth/verify-signature:
 *   post:
 *     summary: 测试验证签名（仅开发环境使用）
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
 *               message:
 *                 type: string
 *                 description: 原始签名消息
 *     responses:
 *       200:
 *         description: 返回验证结果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/verify-signature', async (ctx) => {
  // 明确类型，防止类型报错
  const { address, signature, message } = ctx.request.body as { address: string; signature: string; message: string };
  
  if (!address || !signature || !message) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }
  
  try {
    console.log('验证消息:', message);
    
    // 用ethers.js校验签名
    const recoveredAddress = verifyMessage(message, signature);
    console.log('恢复的地址:', recoveredAddress);
    console.log('提供的地址:', address);
    
    const isMatch = recoveredAddress.toLowerCase() === address.toLowerCase();
    
    ctx.body = { 
      success: isMatch, 
      recoveredAddress,
      providedAddress: address,
      match: isMatch
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { 
      error: '签名校验出错', 
      detail: (err as Error).message,
      stack: (err as Error).stack 
    };
  }
});

/**
 * @swagger
 * /auth/health:
 *   get:
 *     summary: 身份认证服务健康检查
 *     tags:
 *       - 认证
 *     responses:
 *       200:
 *         description: 服务正常
 */
router.get('/health', async (ctx) => {
  ctx.body = { 
    status: 'ok', 
    service: 'auth', 
    timestamp: new Date().toISOString(),
    mode: 'memory-store'  // 表明使用的是内存存储模式
  };
});

export default router; 