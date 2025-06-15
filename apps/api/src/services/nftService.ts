import * as nftModel from '@/models/nftModel';
import type { NFTProof } from '@/prisma/web3cv';

/**
 * 查询用户 NFT 证明列表 Service
 * @param userId 用户ID
 * @returns NFT 证明数组
 */
export async function getUserNfts(userId: string): Promise<NFTProof[]> {
  try {
    return await nftModel.getNftsByUserId(userId);
  } catch (error) {
    throw new Error('查询用户 NFT 证明失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 记录链上成就 Service
 * @param userId 用户ID
 * @param nftType 成就类型
 * @param tokenId 链上TokenId
 * @param txHash 链上交易哈希
 * @param mintedAt 铸造时间，默认当前时间
 * @returns NFT 证明ID
 */
export async function recordNftAchievement(userId: string, nftType: string, tokenId: string, txHash: string, mintedAt: Date = new Date()): Promise<string> {
  try {
    const nft = await nftModel.createNft(userId, nftType, tokenId, txHash, mintedAt);
    return nft.id;
  } catch (error) {
    throw new Error('记录链上成就失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 预留：链上交互接口（如 mint NFT、查询链上状态等）
 * @param params 交互参数
 * @returns 交互结果
 */
export async function blockchainInteraction(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  // TODO: 集成实际链上交互逻辑
  // 这里只做参数校验和异常处理示例
  if (!params || typeof params !== 'object') {
    throw new Error('参数无效');
  }
  // 示例返回
  return { status: 'not_implemented', params };
} 