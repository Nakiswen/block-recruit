/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 获取登录挑战消息
     * @param address 钱包地址
     * @returns any 返回需要签名的挑战消息
     * @throws ApiError
     */
    public getAuthChallenge(
        address: string,
    ): CancelablePromise<{
        /**
         * 需要签名的消息
         */
        message?: string;
        /**
         * 随机挑战码
         */
        nonce?: string;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/challenge',
            query: {
                'address': address,
            },
        });
    }
    /**
     * 验证签名并登录
     * @param requestBody
     * @returns any 登录成功，返回JWT token
     * @throws ApiError
     */
    public postAuthLogin(
        requestBody: {
            /**
             * 钱包地址
             */
            address?: string;
            /**
             * 钱包签名
             */
            signature?: string;
            /**
             * 随机挑战码
             */
            nonce?: string;
        },
    ): CancelablePromise<{
        token?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `签名无效`,
            },
        });
    }
    /**
     * 测试验证签名（仅开发环境使用）
     * @param requestBody
     * @returns any 返回验证结果
     * @throws ApiError
     */
    public postAuthVerifySignature(
        requestBody: {
            /**
             * 钱包地址
             */
            address?: string;
            /**
             * 钱包签名
             */
            signature?: string;
            /**
             * 原始签名消息
             */
            message?: string;
        },
    ): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/verify-signature',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 身份认证服务健康检查
     * @returns any 服务正常
     * @throws ApiError
     */
    public getAuthHealth(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/health',
        });
    }
}
