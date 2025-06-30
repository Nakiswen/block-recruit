/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 查询当前用户信息及其投递记录
     * @returns any 返回用户信息
     * @throws ApiError
     */
    public getUsersMe(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/me',
        });
    }
}
