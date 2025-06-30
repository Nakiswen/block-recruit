/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { ApplicationsService } from './services/ApplicationsService';
import { AuthService } from './services/AuthService';
import { JobsService } from './services/JobsService';
import { NftService } from './services/NftService';
import { ResumesService } from './services/ResumesService';
import { UsersService } from './services/UsersService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class BlockRecruitAPI {
    public readonly applications: ApplicationsService;
    public readonly auth: AuthService;
    public readonly jobs: JobsService;
    public readonly nft: NftService;
    public readonly resumes: ResumesService;
    public readonly users: UsersService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '/api',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? true,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.applications = new ApplicationsService(this.request);
        this.auth = new AuthService(this.request);
        this.jobs = new JobsService(this.request);
        this.nft = new NftService(this.request);
        this.resumes = new ResumesService(this.request);
        this.users = new UsersService(this.request);
    }
}

