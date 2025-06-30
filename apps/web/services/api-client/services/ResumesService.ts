/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ResumesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 上传简历文件(pdf, docx, png, jpg)
     * @param formData
     * @returns any 上传成功，返回简历ID和匹配的岗位列表
     * @throws ApiError
     */
    public postResumesUpload(
        formData: {
            /**
             * 简历文件
             */
            resume?: Blob;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/resumes/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * 当前用户简历与推荐岗位的匹配分析
     * @returns any 匹配分析完成，返回匹配的岗位列表数据
     * @throws ApiError
     */
    public postResumesMatch(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/resumes/match',
            errors: {
                401: `用户未授权`,
                404: `用户没有简历或没有推荐岗位`,
            },
        });
    }
    /**
     * 获取简历匹配的岗位列表
     * @param resumeId
     * @param minMatchScore
     * @param location
     * @param industry
     * @param educationLevel
     * @param experienceYears
     * @returns any 返回匹配的岗位列表数据
     * @throws ApiError
     */
    public getResumesMatchingJobs(
        resumeId: string,
        minMatchScore?: number,
        location?: string,
        industry?: string,
        educationLevel?: string,
        experienceYears?: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/resumes/{resumeId}/matching-jobs',
            path: {
                'resumeId': resumeId,
            },
            query: {
                'minMatchScore': minMatchScore,
                'location': location,
                'industry': industry,
                'educationLevel': educationLevel,
                'experienceYears': experienceYears,
            },
        });
    }
}
