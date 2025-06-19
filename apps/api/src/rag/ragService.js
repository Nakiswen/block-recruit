"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragService = void 0;
var pineconeClient_1 = require("./pineconeClient");
var embeddingService_1 = require("./embeddingService");
var types_1 = require("./types");
var client_1 = require("../prisma/client");
/**
 * RAG服务，提供向量存储和检索功能
 */
exports.ragService = {
    /**
     * 初始化RAG服务
     */
    init: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pineconeClient_1.PineconeClient.init()];
                    case 1:
                        _a.sent();
                        console.log('RAG服务初始化完成');
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 批量处理岗位信息，生成向量并存储
     * @param jobIds 需要处理的岗位ID列表
     * @returns 处理结果统计
     */
    processJobs: function (jobIds) {
        return __awaiter(this, void 0, void 0, function () {
            var jobs, results, _i, jobs_1, job, jobData, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, client_1.jobsPrisma.job_posting.findMany({
                                where: { topic_id: { in: jobIds.map(function (id) { return BigInt(id); }) } }
                            })];
                    case 1:
                        jobs = _a.sent();
                        if (!jobs.length) {
                            throw new Error('未找到指定的岗位');
                        }
                        results = {
                            total: jobs.length,
                            success: 0,
                            failed: 0,
                            errors: []
                        };
                        _i = 0, jobs_1 = jobs;
                        _a.label = 2;
                    case 2:
                        if (!(_i < jobs_1.length)) return [3 /*break*/, 7];
                        job = jobs_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        jobData = {
                            id: job.topic_id.toString(),
                            title: job.position_name,
                            description: job.content || '',
                            companyName: job.company,
                            salaryRange: job.min_salary && job.max_salary ?
                                "".concat(job.min_salary, "-").concat(job.max_salary) : undefined,
                            location: job.location || undefined,
                            responsibilities: job.content2 || undefined,
                            requirements: job.content3 || undefined,
                            // 这里可能需要从tag关系表中获取技能
                            skills: [],
                            industry: undefined,
                            experienceYears: undefined,
                            educationLevel: undefined,
                            level: job.lever_name || undefined,
                        };
                        return [4 /*yield*/, this.processJob(jobData)];
                    case 4:
                        _a.sent();
                        results.success++;
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        results.failed++;
                        results.errors.push("\u5C97\u4F4DID ".concat(job.topic_id.toString(), ": ").concat(error_1.message));
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, results];
                    case 8:
                        error_2 = _a.sent();
                        console.error('批量处理岗位失败:', error_2);
                        throw error_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 处理单个岗位信息，生成向量并存储
     * @param job 岗位数据
     * @returns 处理后的向量ID
     */
    processJob: function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var structuredData, vector, vectorId, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.extractJobStructuredData(job)];
                    case 1:
                        structuredData = _a.sent();
                        return [4 /*yield*/, embeddingService_1.embeddingService.generateEmbedding(this.formatJobForEmbedding(job, structuredData))];
                    case 2:
                        vector = _a.sent();
                        vectorId = "job_".concat(job.id);
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.upsert({
                                id: vectorId,
                                vector: vector,
                                metadata: {
                                    id: job.id,
                                    title: job.title,
                                    company: job.companyName,
                                    required_skills: structuredData.requiredSkills,
                                    preferred_skills: structuredData.preferredSkills,
                                    experience_years: structuredData.experienceYears,
                                    education_level: structuredData.educationLevel,
                                    industry: structuredData.industry,
                                    salary_range: job.salaryRange,
                                    location: job.location,
                                    job_level: structuredData.jobLevel,
                                    update_time: new Date().toISOString()
                                }
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, vectorId];
                    case 4:
                        error_3 = _a.sent();
                        console.error('处理岗位失败:', error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 处理简历信息，生成向量并存储
     * @param resumeId 简历ID
     * @returns 处理后的向量ID
     */
    processResume: function (resumeId) {
        return __awaiter(this, void 0, void 0, function () {
            var resumeData, resume, structuredData, vector, vectorId, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, client_1.resumePrisma.resume.findUnique({
                                where: { id: resumeId }
                            })];
                    case 1:
                        resumeData = _a.sent();
                        if (!resumeData) {
                            throw new Error('未找到指定的简历');
                        }
                        resume = {
                            id: resumeData.id,
                            userId: resumeData.userId,
                            content: resumeData.content,
                            parsedContent: resumeData.parsedContent || undefined,
                            // 以下字段可能需要从解析的内容中获取
                            skills: [],
                            experienceYears: 0,
                            educationLevel: '',
                            industry: '',
                            location: '',
                            summary: '',
                            workExperience: '',
                            projects: '',
                            education: ''
                        };
                        return [4 /*yield*/, this.extractResumeStructuredData(resume)];
                    case 2:
                        structuredData = _a.sent();
                        return [4 /*yield*/, embeddingService_1.embeddingService.generateEmbedding(this.formatResumeForEmbedding(resume, structuredData))];
                    case 3:
                        vector = _a.sent();
                        vectorId = "resume_".concat(resume.id);
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.upsert({
                                id: vectorId,
                                vector: vector,
                                metadata: {
                                    id: resume.id,
                                    owner: resume.userId,
                                    skills: structuredData.skills,
                                    experience_years: structuredData.experienceYears,
                                    education_level: structuredData.educationLevel,
                                    industry_experience: structuredData.industryExperience,
                                    location: structuredData.location,
                                    update_time: new Date().toISOString()
                                }
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, vectorId];
                    case 5:
                        error_4 = _a.sent();
                        console.error('处理简历失败:', error_4);
                        throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 获取岗位向量信息
     * @param jobId 岗位ID
     * @returns 岗位向量信息，如果不存在则返回null
     */
    getJobVector: function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var vectorId, vector, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vectorId = "job_".concat(jobId);
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.fetch(vectorId)];
                    case 1:
                        vector = _a.sent();
                        if (!vector) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: vectorId,
                                vector: vector.vector,
                                metadata: vector.metadata
                            }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('获取岗位向量失败:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 获取简历向量信息
     * @param resumeId 简历ID
     * @returns 简历向量信息，如果不存在则返回null
     */
    getResumeVector: function (resumeId) {
        return __awaiter(this, void 0, void 0, function () {
            var vectorId, vector, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vectorId = "resume_".concat(resumeId);
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.fetch(vectorId)];
                    case 1:
                        vector = _a.sent();
                        if (!vector) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: vectorId,
                                vector: vector.vector,
                                metadata: vector.metadata
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error('获取简历向量失败:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 查找与指定向量相似的岗位
     * @param vector 查询向量
     * @param options 查询选项
     * @returns 相似岗位列表
     */
    findSimilarJobs: function (vector, options) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, searchResults, searchTimeMs, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startTime = Date.now();
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.search({
                                vector: vector,
                                topK: options.topK || 50,
                                filter: options.filters || {},
                                minScore: options.minScore || 0.5,
                                indexType: types_1.PineconeIndexType.JOB
                            })];
                    case 1:
                        searchResults = _a.sent();
                        searchTimeMs = Date.now() - startTime;
                        return [2 /*return*/, {
                                matches: searchResults.map(function (result) { return ({
                                    id: result.metadata.id,
                                    score: result.score,
                                    metadata: result.metadata
                                }); }),
                                totalCandidates: searchResults.length,
                                searchTimeMs: searchTimeMs
                            }];
                    case 2:
                        error_7 = _a.sent();
                        console.error('查找相似岗位失败:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 查找与指定向量相似的简历
     * @param vector 查询向量
     * @param options 查询选项
     * @returns 相似简历列表
     */
    findSimilarResumes: function (vector, options) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, searchResults, searchTimeMs, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startTime = Date.now();
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.search({
                                vector: vector,
                                topK: options.topK || 50,
                                filter: options.filters || {},
                                minScore: options.minScore || 0.5,
                                indexType: types_1.PineconeIndexType.RESUME
                            })];
                    case 1:
                        searchResults = _a.sent();
                        searchTimeMs = Date.now() - startTime;
                        return [2 /*return*/, {
                                matches: searchResults.map(function (result) { return ({
                                    id: result.metadata.id,
                                    score: result.score,
                                    metadata: result.metadata
                                }); }),
                                totalCandidates: searchResults.length,
                                searchTimeMs: searchTimeMs
                            }];
                    case 2:
                        error_8 = _a.sent();
                        console.error('查找相似简历失败:', error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 删除岗位向量
     * @param jobId 岗位ID
     */
    deleteJobVector: function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var vectorId, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vectorId = "job_".concat(jobId);
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.delete(vectorId)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('删除岗位向量失败:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 删除简历向量
     * @param resumeId 简历ID
     */
    deleteResumeVector: function (resumeId) {
        return __awaiter(this, void 0, void 0, function () {
            var vectorId, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        vectorId = "resume_".concat(resumeId);
                        return [4 /*yield*/, pineconeClient_1.PineconeClient.delete(vectorId)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error('删除简历向量失败:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 从岗位中提取结构化数据
     * @param job 岗位数据
     * @returns 结构化的岗位信息
     */
    extractJobStructuredData: function (job) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // 这里应该调用AI服务，但目前简单返回默认值和已有数据
                return [2 /*return*/, {
                        requiredSkills: job.skills || [],
                        preferredSkills: [],
                        experienceYears: job.experienceYears || 0,
                        educationLevel: job.educationLevel || '',
                        industry: job.industry || '',
                        jobLevel: job.level || '初级'
                    }];
            });
        });
    },
    /**
     * 从简历中提取结构化数据
     * @param resume 简历数据
     * @returns 结构化的简历信息
     */
    extractResumeStructuredData: function (resume) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // 这里应该调用AI服务，但目前简单返回默认值和已有数据
                return [2 /*return*/, {
                        skills: resume.skills || [],
                        experienceYears: resume.experienceYears || 0,
                        educationLevel: resume.educationLevel || '',
                        industryExperience: [resume.industry || ''].filter(Boolean),
                        location: resume.location || ''
                    }];
            });
        });
    },
    /**
     * 格式化岗位信息用于生成embedding
     * @param job 岗位数据
     * @param structuredData 结构化岗位数据
     * @returns 格式化后的文本
     */
    formatJobForEmbedding: function (job, structuredData) {
        return "\n      \u804C\u4F4D\u6807\u9898: ".concat(job.title, "\n      \u516C\u53F8\u540D\u79F0: ").concat(job.companyName || '', "\n      \u5DE5\u4F5C\u5730\u70B9: ").concat(job.location || '', "\n      \u85AA\u8D44\u8303\u56F4: ").concat(job.salaryRange || '', "\n      \u5C97\u4F4D\u63CF\u8FF0: ").concat(job.description || '', "\n      \u5C97\u4F4D\u804C\u8D23: ").concat(job.responsibilities || '', "\n      \u5FC5\u5907\u6280\u80FD: ").concat(structuredData.requiredSkills.join(', '), "\n      \u52A0\u5206\u6280\u80FD: ").concat(structuredData.preferredSkills.join(', '), "\n      \u5DE5\u4F5C\u7ECF\u9A8C\u8981\u6C42: ").concat(structuredData.experienceYears, "\u5E74\n      \u5B66\u5386\u8981\u6C42: ").concat(structuredData.educationLevel, "\n      \u884C\u4E1A: ").concat(structuredData.industry, "\n      \u5C97\u4F4D\u7EA7\u522B: ").concat(structuredData.jobLevel, "\n    ");
    },
    /**
     * 格式化简历信息用于生成embedding
     * @param resume 简历数据
     * @param structuredData 结构化简历数据
     * @returns 格式化后的文本
     */
    formatResumeForEmbedding: function (resume, structuredData) {
        return "\n      \u59D3\u540D: ".concat(resume.name || '', "\n      \u6280\u80FD: ").concat(structuredData.skills.join(', '), "\n      \u5DE5\u4F5C\u7ECF\u9A8C: ").concat(structuredData.experienceYears, "\u5E74\n      \u5B66\u5386: ").concat(structuredData.educationLevel, "\n      \u884C\u4E1A\u7ECF\u9A8C: ").concat(structuredData.industryExperience.join(', '), "\n      \u5DE5\u4F5C\u5730\u70B9: ").concat(structuredData.location, "\n      \u4E2A\u4EBA\u7B80\u4ECB: ").concat(resume.summary || '', "\n      \u5DE5\u4F5C\u7ECF\u5386: ").concat(resume.workExperience || '', "\n      \u9879\u76EE\u7ECF\u5386: ").concat(resume.projects || '', "\n      \u6559\u80B2\u80CC\u666F: ").concat(resume.education || '', "\n    ");
    }
};
