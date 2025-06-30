/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ApplicationsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 创建投递记录
     * @param requestBody
     * @returns any 创建成功，返回投递记录ID
     * @throws ApiError
     */
    public postApplicationsCreateApplication(
        requestBody: {
            /**
             * 用户ID
             */
            userId?: string;
            /**
             * 岗位ID
             */
            jobId?: string;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/applications/createApplication',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 查询用户投递历史
     * @param userId 用户ID
     * @returns any 返回投递记录数组
     * @throws ApiError
     */
    public getApplicationsGetHistoryByUserId(
        userId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/applications/getHistoryByUserId',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * 查询岗位投递记录
     * @param jobId 岗位ID
     * @returns any 返回投递记录数组
     * @throws ApiError
     */
    public getApplicationsGetHistoryByJobId(
        jobId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/applications/getHistoryByJobId',
            query: {
                'jobId': jobId,
            },
        });
    }
}
