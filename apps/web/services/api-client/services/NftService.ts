/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NftService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * 查询用户 NFT 证明
   * @param userId 用户ID
   * @returns any 返回 NFT 证明数组
   * @throws ApiError
   */
  public getNftUser(userId: string): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/nft/user',
      query: {
        userId: userId,
      },
    });
  }
  /**
   * 记录链上成就
   * @param requestBody
   * @returns any 创建成功，返回 NFT 证明ID
   * @throws ApiError
   */
  public postNftAchievement(requestBody: {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 成就类型
     */
    type?: string;
    /**
     * 成就数据
     */
    data?: string;
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/nft/achievement',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 链上交互接口
   * @param requestBody
   * @returns any 交互结果
   * @throws ApiError
   */
  public postNftBlockchain(requestBody: Record<string, any>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/nft/blockchain',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
