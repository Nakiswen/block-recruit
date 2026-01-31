import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量：先加载根目录的 .env，再加载本地的 .env.local
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// 创建Redis实例或模拟实例
let redis: Redis;

try {
  // 尝试连接真实Redis
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD, // 如有密码请通过环境变量设置
    connectTimeout: 10000, // 连接超时时间
    maxRetriesPerRequest: 3, // 增加重试次数
    retryStrategy: times => {
      // 最多重试5次，指数退避
      if (times > 5) return null;
      return Math.min(times * 2000, 10000); // 2s, 4s, 6s, 8s, 10s
    },
    lazyConnect: false, // 立即连接
    keepAlive: true, // 保持连接活跃
  });

  // 添加错误处理
  redis.on('error', (err: Error) => {
    console.warn(`Redis连接失败: ${err.message}`);
    // 仅记录错误，不再重试连接
  });

  // 添加连接成功回调
  redis.on('connect', () => {
    console.log('Redis连接成功');
  });
} catch (error) {
  console.warn(`Redis初始化失败: ${error instanceof Error ? error.message : String(error)}`);
  // 创建一个空的Redis实例作为备用，避免应用崩溃
  redis = new Redis({
    lazyConnect: true, // 不要尝试连接
    retryStrategy: () => null,
  });
}

// 创建一个内存模拟版本的获取/设置方法
const originalGet = redis.get.bind(redis);
const originalSet = redis.set.bind(redis);

const memoryCache = new Map<string, string>();

// 重写get方法，添加内存缓存备份
redis.get = async function (key: string) {
  try {
    const result = await originalGet(key);
    return result;
  } catch (error) {
    console.warn(
      `Redis.get 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`
    );
    return memoryCache.get(key) || null;
  }
};

// 重写set方法，添加内存缓存备份
redis.set = async function (key: string, value: string, ...args: any[]) {
  try {
    const result = await originalSet(key, value, ...args);
    memoryCache.set(key, value);
    return result;
  } catch (error) {
    console.warn(
      `Redis.set 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`
    );
    memoryCache.set(key, value);
    return 'OK';
  }
};

export default redis;
