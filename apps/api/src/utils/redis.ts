import Redis from 'ioredis';

// 创建 Redis 实例，默认连接本地 6379 端口
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  // password: 'yourpassword', // 如有密码请取消注释
});

export default redis; 