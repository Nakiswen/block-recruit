# Redis 配置教程

## 简介

Redis是一个开源的内存数据结构存储系统，本项目使用Redis作为缓存和临时数据存储，提高应用性能并减少对数据库的请求。

## 安装选项

### 选项1: 本地安装Redis

1. **Windows**: 
   - 下载[Redis for Windows](https://github.com/tporadowski/redis/releases)
   - 安装并启动Redis服务

2. **macOS**:
   ```bash
   brew install redis
   brew services start redis
   ```

3. **Linux (Ubuntu/Debian)**:
   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo systemctl start redis-server
   ```

### 选项2: 使用Docker容器

```bash
docker run --name block-recruit-redis -p 6379:6379 -d redis
```

### 选项3: 使用Redis云服务

1. 注册[Redis官方云服务](https://redis.com/try-free/)账号
2. 创建一个新的Redis数据库实例
3. 获取连接信息(主机、端口、密码)

## Redis官方云账号配置

对于生产环境，推荐使用Redis官方云服务：

1. 访问[Redis官方云服务](https://redis.com/try-free/)并注册账号
2. 登录后点击"Create Database"创建数据库实例
3. 选择免费计划或适合项目需求的付费计划
4. 选择云提供商和地区(靠近您的应用服务器)
5. 设置数据库名称(如"block-recruit-cache")
6. 创建并等待实例部署完成
7. 在数据库详情页面，找到并记录以下信息:
   - 公共端点(Endpoint)
   - 端口号(通常为6379或15000)
   - 默认用户(通常为"default")
   - 密码

## 环境变量配置

在项目的`.env`文件中，添加以下Redis相关的环境变量：

```
# Redis配置
REDIS_HOST=your_redis_host  # 本地为127.0.0.1，云服务使用提供的端点
REDIS_PORT=6379  # 或云服务提供的端口
REDIS_PASSWORD=your_redis_password  # 如果有密码
```

## 项目集成

本项目使用`ioredis`库连接Redis。主要配置文件位于`apps/api/src/utils/redis.ts`，包含以下关键设置：

```javascript
// Redis连接配置
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  // 只有在设置了密码时才添加用户名
  ...(process.env.REDIS_PASSWORD ? { username: 'default' } : {}), 
  password: process.env.REDIS_PASSWORD, // 如有密码请通过环境变量设置
  connectTimeout: 5000, // 连接超时时间
  maxRetriesPerRequest: 1, // 减少重试次数
  retryStrategy: (times) => {
    // 最多重试3次，每次间隔1秒
    if (times > 3) return null;
    return 1000;
  },
  lazyConnect: true, // 懒连接，不在初始化时连接
});
```

## 验证配置

可以使用以下方法验证Redis连接是否正常：

### 方法1：使用Redis CLI

```bash
# 本地Redis
redis-cli ping

# 带密码的远程Redis
redis-cli -h your_redis_host -p your_redis_port -a your_password ping
```

如果返回"PONG"，表示连接成功。

### 方法2：通过项目API验证

启动项目API服务，检查日志中是否有"Redis连接成功"消息。

## 常见用途

本项目中Redis主要用于以下场景：

1. **缓存API响应**：减少数据库查询，提高API响应速度
   ```javascript
   // 查询缓存示例
   const cacheKey = `job_list_${page}_${pageSize}`;
   const cacheData = await redis.get(cacheKey);
   if (cacheData) {
     return { jobs: JSON.parse(cacheData), cache: true };
   }
   
   // 设置缓存示例
   await redis.set(cacheKey, JSON.stringify(jobs), 'EX', 60); // 缓存60秒
   ```

2. **存储临时ID映射**：用于简历和岗位的临时ID与实际ID之间的映射
   ```javascript
   // Redis键前缀
   const REDIS_KEY_PREFIX = 'resume:id:map:';
   
   // 存储映射，24小时过期
   await redis.set(`${REDIS_KEY_PREFIX}${tempId}`, realId, 'EX', 86400);
   ```

3. **会话管理**：存储登录令牌和用户会话信息

## 故障排除

### 常见问题

1. **连接错误**：
   - 检查主机名和端口是否正确
   - 确认密码是否正确设置
   - 检查网络防火墙是否允许连接

2. **内存使用过高**：
   - 配置合适的最大内存限制
   - 设置适当的缓存过期策略

3. **连接超时**：
   - 增加连接超时设置
   - 检查网络质量和延迟

### 离线功能

项目设计了在Redis不可用时的降级策略：

```javascript
// 创建一个内存模拟版本的获取/设置方法
const memoryCache = new Map<string, string>();

// 重写get方法，添加内存缓存备份
redis.get = async function(key: string) {
  try {
    const result = await originalGet(key);
    return result;
  } catch (error) {
    console.warn(`Redis.get 失败，使用内存缓存`);
    return memoryCache.get(key) || null;
  }
};
```

这确保即使Redis连接失败，应用程序也能继续运行，只是性能可能会受到影响。

## 安全最佳实践

1. **设置强密码**：为Redis实例设置复杂密码
2. **禁用危险命令**：在生产环境中禁用或重命名 FLUSHDB、FLUSHALL 等命令
3. **使用SSL/TLS**：确保远程Redis连接使用加密通信
4. **IP限制**：限制只允许应用服务器IP连接Redis
5. **定期备份**：设置Redis数据定期备份策略

## 监控和维护

### 监控指标

重要的Redis监控指标：
- 内存使用率
- 命令执行延迟
- 客户端连接数
- 缓存命中率
- 过期键数量

### 维护操作

1. **定期检查日志**：查找错误和性能问题
2. **清理未使用的键**：删除不再需要的数据
3. **优化内存设置**：根据实际使用情况调整内存配置
4. **升级版本**：保持Redis版本更新以获取安全补丁和性能改进

## 资源链接

- [Redis官方文档](https://redis.io/documentation)
- [Redis官方云服务文档](https://docs.redis.com/)
- [ioredis库文档](https://github.com/redis/ioredis) 