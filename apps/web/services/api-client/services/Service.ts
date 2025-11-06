/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class Service {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * 创建投递记录
   * @param requestBody
   * @returns any 创建成功，返回投递记录ID
   * @throws ApiError
   */
  public postApplicationsCreateApplication(requestBody: {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 岗位ID
     */
    jobId?: string;
  }): CancelablePromise<any> {
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
  public getApplicationsGetHistoryByUserId(userId: string): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/applications/getHistoryByUserId',
      query: {
        userId: userId,
      },
    });
  }
  /**
   * 查询岗位投递记录
   * @param jobId 岗位ID
   * @returns any 返回投递记录数组
   * @throws ApiError
   */
  public getApplicationsGetHistoryByJobId(jobId: string): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/applications/getHistoryByJobId',
      query: {
        jobId: jobId,
      },
    });
  }
  /**
   * 获取登录挑战消息
   * @param address 钱包地址
   * @returns any 返回需要签名的挑战消息
   * @throws ApiError
   */
  public getAuthChallenge(address: string): CancelablePromise<{
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
        address: address,
      },
    });
  }
  /**
   * 验证签名并登录
   * @param requestBody
   * @returns any 登录成功，返回JWT token
   * @throws ApiError
   */
  public postAuthLogin(requestBody: {
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
  }): CancelablePromise<{
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
  public postAuthVerifySignature(requestBody: {
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
  }): CancelablePromise<Record<string, any>> {
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
  /**
   * 获取岗位列表（带分页和缓存）
   * @param page 页码
   * @param pageSize 每页数量
   * @returns any 返回岗位列表
   * @throws ApiError
   */
  public getJobs(page?: number, pageSize?: number): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/jobs',
      query: {
        page: page,
        pageSize: pageSize,
      },
    });
  }
  /**
   * 上传简历文件(pdf, docx, png, jpg)
   * @param formData
   * @returns any 上传成功，返回简历ID，后台异步处理
   * @throws ApiError
   */
  public postResumesUpload(formData: {
    /**
     * 简历文件
     */
    resume?: Blob;
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/resumes/upload',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `文件格式错误或内容无效`,
        401: `用户未授权`,
      },
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
    experienceYears?: number
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/resumes/{resumeId}/matching-jobs',
      path: {
        resumeId: resumeId,
      },
      query: {
        minMatchScore: minMatchScore,
        location: location,
        industry: industry,
        educationLevel: educationLevel,
        experienceYears: experienceYears,
      },
    });
  }
  /**
   * 获取简历处理进度
   * @param resumeId
   * @returns any 返回处理进度和结果
   * @throws ApiError
   */
  public getResumesProgress(resumeId: string): CancelablePromise<{
    /**
     * 处理进度百分比(0-100)
     */
    progress?: number;
    /**
     * 处理状态
     */
    status?: 'processing' | 'done' | 'failed';
    /**
     * 匹配的岗位列表(仅在status为done时返回)
     */
    jobs?: any[];
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/resumes/{resumeId}/progress',
      path: {
        resumeId: resumeId,
      },
      errors: {
        404: `简历不存在`,
      },
    });
  }
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
