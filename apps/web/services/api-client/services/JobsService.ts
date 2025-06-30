/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class JobsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 获取岗位列表（带分页和缓存）
     * @param page 页码
     * @param pageSize 每页数量
     * @returns any 返回岗位列表
     * @throws ApiError
     */
    public getJobs(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/jobs',
            query: {
                'page': page,
                'pageSize': pageSize,
            },
        });
    }
}
