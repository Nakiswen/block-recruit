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

const memoryCache = new Map<string, { value: string; expiresAt?: number }>();

function getMemoryValue(key: string): string | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt && cached.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return cached.value;
}

function setMemoryValue(key: string, value: string, args: any[]) {
  const exIndex = args.findIndex(arg => String(arg).toUpperCase() === 'EX');
  const ttlSeconds = exIndex >= 0 ? Number(args[exIndex + 1]) : undefined;
  memoryCache.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  });
}

function createMemoryRedisFallback(): Redis {
  const fallback = new Redis({
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy: () => null,
  });

  (fallback as any).get = async function (key: string) {
    return getMemoryValue(key);
  };

  (fallback as any).set = async function (key: string, value: string, ...args: any[]) {
    setMemoryValue(key, value, args);
    return 'OK';
  };

  (fallback as any).del = async function (...keys: string[]) {
    let deleted = 0;
    keys.forEach(key => {
      if (memoryCache.delete(key)) deleted += 1;
    });
    return deleted;
  };

  (fallback as any).keys = async function (pattern: string) {
    const prefix = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
    return Array.from(memoryCache.keys()).filter(key =>
      pattern.endsWith('*') ? key.startsWith(prefix) : key === pattern
    );
  };

  return fallback;
}

// 创建Redis实例或模拟实例
let redis: Redis;
let redisMode: 'redis-url' | 'redis-host' | 'memory-fallback' = 'memory-fallback';
let redisConnectPromise: Promise<void> | null = null;

function waitForRedisReady() {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Redis connection timed out'));
    }, 5000);

    const cleanup = () => {
      clearTimeout(timeout);
      redis.off('ready', onReady);
      redis.off('error', onError);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    redis.once('ready', onReady);
    redis.once('error', onError);
  });
}

async function ensureRedisConnected() {
  if (redisMode === 'memory-fallback' || redis.status === 'ready') return;

  if (redis.status === 'wait' || redis.status === 'end' || redis.status === 'close') {
    redisConnectPromise ??= redis.connect().then(
      () => undefined,
      error => {
        redisConnectPromise = null;
        throw error;
      }
    );
    await redisConnectPromise;
    return;
  }

  await waitForRedisReady();
}

try {
  const redisUrl = process.env.REDIS_URL;
  const hasHostConfig = Boolean(process.env.REDIS_HOST);

  if (!redisUrl && !hasHostConfig) {
    redis = createMemoryRedisFallback();
    redisMode = 'memory-fallback';
  } else {
    redis = redisUrl
      ? new Redis(redisUrl, {
          connectTimeout: 10000,
          maxRetriesPerRequest: 2,
          enableOfflineQueue: false,
          lazyConnect: true,
          tls: redisUrl.startsWith('rediss://') ? {} : undefined,
          retryStrategy: times => (times > 2 ? null : Math.min(times * 500, 2000)),
        })
      : new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT || 6379),
          username: process.env.REDIS_USERNAME || undefined,
          password: process.env.REDIS_PASSWORD || undefined,
          tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
          connectTimeout: 10000,
          maxRetriesPerRequest: 2,
          enableOfflineQueue: false,
          lazyConnect: true,
          retryStrategy: times => (times > 2 ? null : Math.min(times * 500, 2000)),
        });
    redisMode = redisUrl ? 'redis-url' : 'redis-host';

    redis.on('error', (err: Error) => {
      console.warn(`Redis连接失败: ${err.message}`);
    });

    redis.on('connect', () => {
      console.log('Redis连接成功');
    });
  }
} catch (error) {
  console.warn(`Redis初始化失败: ${error instanceof Error ? error.message : String(error)}`);
  redis = createMemoryRedisFallback();
  redisMode = 'memory-fallback';
}

// 重写get方法，添加内存缓存备份
const originalGet = redis.get.bind(redis);
(redis as any).get = async function (key: string) {
  try {
    await ensureRedisConnected();
    const result = await originalGet(key);
    return result;
  } catch (error) {
    console.warn(
      `Redis.get 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`
    );
    return getMemoryValue(key);
  }
};

// 重写set方法，添加内存缓存备份
const originalSet = redis.set.bind(redis);
(redis as any).set = async function (key: string, value: string, ...args: any[]) {
  try {
    await ensureRedisConnected();
    const result = await originalSet(key, value, ...args);
    setMemoryValue(key, value, args);
    return result;
  } catch (error) {
    console.warn(
      `Redis.set 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`
    );
    setMemoryValue(key, value, args);
    return 'OK';
  }
};

const originalDel = redis.del.bind(redis);
(redis as any).del = async function (...keys: string[]) {
  try {
    await ensureRedisConnected();
    const result = await originalDel(...keys);
    keys.forEach(key => memoryCache.delete(key));
    return result;
  } catch (error) {
    console.warn(
      `Redis.del 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`
    );
    let deleted = 0;
    keys.forEach(key => {
      if (memoryCache.delete(key)) deleted += 1;
    });
    return deleted;
  }
};

const originalKeys = redis.keys.bind(redis);
(redis as any).keys = async function (pattern: string) {
  try {
    await ensureRedisConnected();
    return await originalKeys(pattern);
  } catch (error) {
    console.warn(
      `Redis.keys 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`
    );
    const prefix = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
    return Array.from(memoryCache.keys()).filter(key =>
      pattern.endsWith('*') ? key.startsWith(prefix) : key === pattern
    );
  }
};

export function getRedisMode() {
  return redisMode;
}

export default redis;
