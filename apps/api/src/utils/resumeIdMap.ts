// 临时ID和真实ID的映射工具
import redis from './redis';

// 内存缓存作为快速访问层
const tempToRealIdMap = new Map<string, string>();

// Redis键前缀
const REDIS_KEY_PREFIX = 'resume:id:map:';

/**
 * 设置临时ID到真实ID的映射
 * @param tempId 临时ID
 * @param realId 真实ID
 */
export async function setResumeIdMapping(tempId: string, realId: string) {
  // 同时更新内存缓存和Redis
  tempToRealIdMap.set(tempId, realId);
  
  try {
    // 在Redis中存储映射，设置24小时过期
    await redis.set(`${REDIS_KEY_PREFIX}${tempId}`, realId, 'EX', 86400);
  } catch (error) {
    console.warn(`Redis存储简历ID映射失败: ${error instanceof Error ? error.message : String(error)}`);
    // 即使Redis失败，内存缓存仍然可用
  }
}

/**
 * 获取临时ID对应的真实ID
 * @param tempId 临时ID
 * @returns 真实ID或undefined
 */
export async function getRealResumeIdAsync(tempId: string): Promise<string | null> {
  // 先查内存缓存
  const cachedId = tempToRealIdMap.get(tempId);
  if (cachedId) {
    return cachedId;
  }
  
  try {
    // 再查Redis
    const redisId = await redis.get(`${REDIS_KEY_PREFIX}${tempId}`);
    if (redisId) {
      // 更新内存缓存
      tempToRealIdMap.set(tempId, redisId);
      return redisId;
    }
  } catch (error) {
    console.warn(`Redis获取简历ID映射失败: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return null;
}

/**
 * 获取临时ID对应的真实ID (同步版本)
 * @param tempId 临时ID
 * @returns 真实ID或undefined
 */
export function getRealResumeId(tempId: string): string | undefined {
  return tempToRealIdMap.get(tempId);
}

/**
 * 清除过期的ID映射
 * @param tempId 临时ID
 */
export async function clearResumeIdMapping(tempId: string) {
  tempToRealIdMap.delete(tempId);
  
  try {
    await redis.del(`${REDIS_KEY_PREFIX}${tempId}`);
  } catch (error) {
    console.warn(`Redis删除简历ID映射失败: ${error instanceof Error ? error.message : String(error)}`);
  }
} 