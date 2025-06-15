import type { Context } from 'koa';
import * as nftService from '@/services/nftService';
import type { NFTProof } from '@/prisma/web3cv';

/**
 * 查询用户 NFT 证明 Controller
 * @param ctx Koa 上下文
 */
export async function getUserNfts(ctx: Context): Promise<void> {
  const { userId } = ctx.query as { userId?: string };
  if (!userId) {
    ctx.status = 400;
    ctx.body = { error: 'userId 必填' };
    return;
  }
  try {
    const nfts: NFTProof[] = await nftService.getUserNfts(userId);
    ctx.body = { nfts };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: (error instanceof Error ? error.message : String(error)) };
  }
}

/**
 * 记录链上成就 Controller
 * @param ctx Koa 上下文
 */
export async function recordNftAchievement(ctx: Context): Promise<void> {
  const { userId, nftType, tokenId, txHash, mintedAt } = ctx.request.body as { userId: string; nftType: string; tokenId: string; txHash: string; mintedAt?: Date };
  if (!userId || !nftType || !tokenId || !txHash) {
    ctx.status = 400;
    ctx.body = { error: 'userId、nftType、tokenId、txHash 必填' };
    return;
  }
  try {
    const id: string = await nftService.recordNftAchievement(userId, nftType, tokenId, txHash, mintedAt);
    ctx.status = 201;
    ctx.body = { id };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: (error instanceof Error ? error.message : String(error)) };
  }
}

/**
 * 链上交互 Controller
 * @param ctx Koa 上下文
 */
export async function blockchainInteraction(ctx: Context): Promise<void> {
  const params = ctx.request.body as Record<string, unknown>;
  try {
    const result: Record<string, unknown> = await nftService.blockchainInteraction(params);
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: (error instanceof Error ? error.message : String(error)) };
  }
} 