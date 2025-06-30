import Redis from 'ioredis';

// 创建Redis实例或模拟实例
let redis: Redis;

try {
  // 尝试连接真实Redis
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    // password: process.env.REDIS_PASSWORD, // 如有密码请通过环境变量设置
    connectTimeout: 5000, // 连接超时时间
    maxRetriesPerRequest: 1, // 减少重试次数
    retryStrategy: () => null, // 返回null禁用自动重连
    lazyConnect: true, // 懒连接，不在初始化时连接
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
  
  // 尝试连接
  redis.connect().catch(() => {
    console.warn('Redis连接失败，功能将受限');
  });
  
} catch (error) {
  console.warn(`Redis初始化失败: ${error instanceof Error ? error.message : String(error)}`);
  // 创建一个空的Redis实例作为备用，避免应用崩溃
  redis = new Redis({
    lazyConnect: true, // 不要尝试连接
    retryStrategy: () => null
  });
}

// 创建一个内存模拟版本的获取/设置方法
const originalGet = redis.get.bind(redis);
const originalSet = redis.set.bind(redis);

const memoryCache = new Map<string, string>();

// 重写get方法，添加内存缓存备份
redis.get = async function(key: string) {
  try {
    const result = await originalGet(key);
    return result;
  } catch (error) {
    console.warn(`Redis.get 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`);
    return memoryCache.get(key) || null;
  }
};

// 重写set方法，添加内存缓存备份
redis.set = async function(key: string, value: string, ...args: any[]) {
  try {
    const result = await originalSet(key, value, ...args);
    memoryCache.set(key, value);
    return result;
  } catch (error) {
    console.warn(`Redis.set 失败，使用内存缓存: ${error instanceof Error ? error.message : String(error)}`);
    memoryCache.set(key, value);
    return 'OK';
  }
};

export default redis; 