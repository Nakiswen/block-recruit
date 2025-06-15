import prisma from '@/prisma/web3cv-prisma';
import type { NFTProof } from '@/prisma/web3cv';

/**
 * 按用户ID查询 NFT 证明
 * @param userId 用户ID
 * @returns NFT 证明数组
 */
export async function getNftsByUserId(userId: string): Promise<NFTProof[]> {
  try {
    return await prisma.nFTProof.findMany({
      where: { userId },
      orderBy: { mintedAt: 'desc' },
    });
  } catch (error) {
    throw new Error('数据库查询 NFT 证明失败: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * 创建 NFT 证明
 * @param userId 用户ID
 * @param nftType 成就/组织等类型
 * @param tokenId 链上TokenId
 * @param txHash 链上交易哈希
 * @param mintedAt 铸造时间，默认当前时间
 * @returns NFT 证明对象
 */
export async function createNft(userId: string, nftType: string, tokenId: string, txHash: string, mintedAt: Date = new Date()): Promise<NFTProof> {
  try {
    const nft = await prisma.nFTProof.create({
      data: { userId, nftType, tokenId, txHash, mintedAt },
    });
    return nft;
  } catch (error) {
    throw new Error('数据库创建 NFT 证明失败: ' + (error instanceof Error ? error.message : String(error)));
  }
} 