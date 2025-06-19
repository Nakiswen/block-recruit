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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PineconeClient = void 0;
var pinecone_1 = require("@pinecone-database/pinecone");
var types_1 = require("./types");
/**
 * Pinecone向量数据库客户端
 * 封装了向量数据库的操作，提供向量存储和检索功能
 */
var PineconeClient = /** @class */ (function () {
    function PineconeClient() {
    }
    /**
     * 初始化Pinecone客户端
     */
    PineconeClient.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, indexList, indexNames, jobIndexName, jobIndexHost, resumeIndexName, resumeIndexHost, jobIndex, resumeIndex, jobStats, resumeStats, connError_1, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.isInitialized) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        config = {
                            apiKey: process.env.PINECONE_API_KEY || '',
                            jobIndexName: process.env.PINECONE_JOB_INDEX_NAME || 'job-vectors',
                            jobIndexHost: process.env.PINECONE_JOB_INDEX_HOST || 'https://job-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io',
                            resumeIndexName: process.env.PINECONE_RESUME_INDEX_NAME || 'resume-vectors',
                            resumeIndexHost: process.env.PINECONE_RESUME_INDEX_HOST || 'https://resume-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io',
                        };
                        if (!config.apiKey) {
                            throw new Error('Pinecone API密钥不能为空，请检查环境变量');
                        }
                        // 初始化Pinecone SDK
                        this.client = new pinecone_1.Pinecone({
                            apiKey: config.apiKey,
                        });
                        return [4 /*yield*/, this.client.listIndexes()];
                    case 2:
                        indexList = _b.sent();
                        indexNames = ((_a = indexList === null || indexList === void 0 ? void 0 : indexList.indexes) === null || _a === void 0 ? void 0 : _a.map(function (index) { return index.name; })) || [];
                        jobIndexName = config.jobIndexName || 'job-vectors';
                        jobIndexHost = config.jobIndexHost || 'https://job-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io';
                        resumeIndexName = config.resumeIndexName || 'resume-vectors';
                        resumeIndexHost = config.resumeIndexHost || 'https://resume-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io';
                        if (!indexNames.includes(jobIndexName)) {
                            throw new Error("Pinecone\u5C97\u4F4D\u7D22\u5F15 ".concat(jobIndexName, " \u4E0D\u5B58\u5728"));
                        }
                        if (!indexNames.includes(resumeIndexName)) {
                            throw new Error("Pinecone\u7B80\u5386\u7D22\u5F15 ".concat(resumeIndexName, " \u4E0D\u5B58\u5728"));
                        }
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        jobIndex = this.client.index(jobIndexName, jobIndexHost);
                        resumeIndex = this.client.index(resumeIndexName, resumeIndexHost);
                        return [4 /*yield*/, jobIndex.describeIndexStats()];
                    case 4:
                        jobStats = _b.sent();
                        return [4 /*yield*/, resumeIndex.describeIndexStats()];
                    case 5:
                        resumeStats = _b.sent();
                        console.log('岗位索引连接成功，向量数量:', jobStats.totalRecordCount);
                        console.log('简历索引连接成功，向量数量:', resumeStats.totalRecordCount);
                        return [3 /*break*/, 7];
                    case 6:
                        connError_1 = _b.sent();
                        throw new Error("\u7D22\u5F15\u8FDE\u63A5\u9A8C\u8BC1\u5931\u8D25: ".concat(connError_1.message));
                    case 7:
                        this.jobIndexName = jobIndexName;
                        this.jobIndexHost = jobIndexHost;
                        this.resumeIndexName = resumeIndexName;
                        this.resumeIndexHost = resumeIndexHost;
                        this.isInitialized = true;
                        console.log('Pinecone客户端初始化成功，岗位索引:', this.jobIndexName, '简历索引:', this.resumeIndexName);
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        console.error('Pinecone客户端初始化失败:', error_1);
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 检查是否已初始化
     */
    PineconeClient.checkInitialized = function () {
        if (!this.isInitialized || !this.client || !this.jobIndexName || !this.resumeIndexName) {
            throw new Error('Pinecone客户端未初始化，请先调用init()');
        }
    };
    /**
     * 根据索引类型获取索引实例
     * @param indexType 索引类型
     */
    PineconeClient.getIndex = function (indexType) {
        if (indexType === void 0) { indexType = types_1.PineconeIndexType.JOB; }
        this.checkInitialized();
        var indexName = indexType === types_1.PineconeIndexType.JOB ? this.jobIndexName : this.resumeIndexName;
        var indexHost = indexType === types_1.PineconeIndexType.JOB ? this.jobIndexHost : this.resumeIndexHost;
        return this.client.index(indexName, indexHost);
    };
    /**
     * 判断向量ID属于哪种索引类型
     * @param id 向量ID
     */
    PineconeClient.getIndexTypeFromId = function (id) {
        if (id.startsWith('job_')) {
            return types_1.PineconeIndexType.JOB;
        }
        else if (id.startsWith('resume_')) {
            return types_1.PineconeIndexType.RESUME;
        }
        else {
            console.warn("\u5411\u91CFID ".concat(id, " \u683C\u5F0F\u4E0D\u7B26\u5408\u89C4\u8303\uFF0C\u5C06\u4F7F\u7528\u5C97\u4F4D\u7D22\u5F15\u4F5C\u4E3A\u9ED8\u8BA4\u503C"));
            return types_1.PineconeIndexType.JOB;
        }
    };
    /**
     * 验证向量数据
     * @param item 向量数据
     */
    PineconeClient.validateVectorItem = function (item) {
        if (!item.id) {
            throw new Error('向量ID不能为空');
        }
        if (!Array.isArray(item.vector) || item.vector.length === 0) {
            throw new Error("\u5411\u91CF\u6570\u636E\u4E0D\u80FD\u4E3A\u7A7A (ID: ".concat(item.id, ")"));
        }
        // 检查向量维度是否合理
        if (item.vector.length !== this.defaultVectorDimension) {
            console.warn("\u5411\u91CF ".concat(item.id, " \u7684\u7EF4\u5EA6(").concat(item.vector.length, ")\u4E0E\u9ED8\u8BA4\u7EF4\u5EA6(").concat(this.defaultVectorDimension, ")\u4E0D\u7B26"));
        }
        // 检查向量中是否有非数字值
        if (!item.vector.every(function (val) { return typeof val === 'number' && !isNaN(val); })) {
            throw new Error("\u5411\u91CF ".concat(item.id, " \u5305\u542B\u975E\u6570\u5B57\u503C"));
        }
    };
    /**
     * 插入或更新向量
     * @param item 向量数据
     */
    PineconeClient.upsert = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var indexType, index, record, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        // 验证向量数据
                        this.validateVectorItem(item);
                        indexType = this.getIndexTypeFromId(item.id);
                        index = this.getIndex(indexType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        record = {
                            id: item.id,
                            values: item.vector,
                            metadata: item.metadata
                        };
                        return [4 /*yield*/, index.upsert([record])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("\u5411\u91CF\u63D2\u5165\u6216\u66F4\u65B0\u5931\u8D25(ID: ".concat(item.id, "):"), error_2);
                        throw new Error("\u5411\u91CF\u64CD\u4F5C\u5931\u8D25: ".concat(error_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 批量插入或更新向量
     * @param items 向量数据列表
     * @param batchSize 批量大小，默认100
     */
    PineconeClient.batchUpsert = function (items_1) {
        return __awaiter(this, arguments, void 0, function (items, batchSize) {
            var _i, items_2, item, jobVectors, resumeVectors, upsertPromises, jobIndex, _loop_1, i, resumeIndex, _loop_2, i, error_3;
            if (batchSize === void 0) { batchSize = 100; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        if (!items || items.length === 0) {
                            console.warn('批量插入向量为空');
                            return [2 /*return*/];
                        }
                        // 验证所有向量数据
                        for (_i = 0, items_2 = items; _i < items_2.length; _i++) {
                            item = items_2[_i];
                            this.validateVectorItem(item);
                        }
                        jobVectors = [];
                        resumeVectors = [];
                        items.forEach(function (item) {
                            if (item.id.startsWith('job_')) {
                                jobVectors.push(item);
                            }
                            else if (item.id.startsWith('resume_')) {
                                resumeVectors.push(item);
                            }
                            else {
                                console.warn("\u5411\u91CFID ".concat(item.id, " \u683C\u5F0F\u4E0D\u7B26\u5408\u89C4\u8303\uFF0C\u5C06\u8DF3\u8FC7\u8BE5\u5411\u91CF"));
                            }
                        });
                        upsertPromises = [];
                        // 处理岗位向量
                        if (jobVectors.length > 0) {
                            jobIndex = this.getIndex(types_1.PineconeIndexType.JOB);
                            _loop_1 = function (i) {
                                var batch = jobVectors.slice(i, i + batchSize);
                                // 转换为Pinecone记录格式
                                var records = batch.map(function (item) { return ({
                                    id: item.id,
                                    values: item.vector,
                                    metadata: item.metadata
                                }); });
                                // 添加到Promise队列
                                upsertPromises.push(jobIndex.upsert(records)
                                    .catch(function (error) {
                                    console.error("\u5C97\u4F4D\u5411\u91CF\u6279\u91CF\u63D2\u5165\u5931\u8D25(\u6279\u6B21 ".concat(i / batchSize + 1, "/").concat(Math.ceil(jobVectors.length / batchSize), "):"), error);
                                    throw error;
                                }));
                            };
                            // 将数据分批处理
                            for (i = 0; i < jobVectors.length; i += batchSize) {
                                _loop_1(i);
                            }
                        }
                        // 处理简历向量
                        if (resumeVectors.length > 0) {
                            resumeIndex = this.getIndex(types_1.PineconeIndexType.RESUME);
                            _loop_2 = function (i) {
                                var batch = resumeVectors.slice(i, i + batchSize);
                                // 转换为Pinecone记录格式
                                var records = batch.map(function (item) { return ({
                                    id: item.id,
                                    values: item.vector,
                                    metadata: item.metadata
                                }); });
                                // 添加到Promise队列
                                upsertPromises.push(resumeIndex.upsert(records)
                                    .catch(function (error) {
                                    console.error("\u7B80\u5386\u5411\u91CF\u6279\u91CF\u63D2\u5165\u5931\u8D25(\u6279\u6B21 ".concat(i / batchSize + 1, "/").concat(Math.ceil(resumeVectors.length / batchSize), "):"), error);
                                    throw error;
                                }));
                            };
                            // 将数据分批处理
                            for (i = 0; i < resumeVectors.length; i += batchSize) {
                                _loop_2(i);
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(upsertPromises)];
                    case 2:
                        _a.sent();
                        console.log("\u6279\u91CF\u5411\u91CF\u63D2\u5165\u5B8C\u6210\uFF0C\u6210\u529F\u5904\u7406 ".concat(jobVectors.length, " \u6761\u5C97\u4F4D\u5411\u91CF\u548C ").concat(resumeVectors.length, " \u6761\u7B80\u5386\u5411\u91CF"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('批量向量插入过程中发生错误:', error_3);
                        throw new Error("\u6279\u91CF\u5411\u91CF\u63D2\u5165\u5931\u8D25: ".concat(error_3.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取向量
     * @param id 向量ID，jobs_xxx | resume_xxx
     * @returns 向量数据，如果不存在则返回null
     */
    PineconeClient.fetch = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var indexType, index, response, record, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        if (!id) {
                            throw new Error('向量ID不能为空');
                        }
                        indexType = this.getIndexTypeFromId(id);
                        index = this.getIndex(indexType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, index.fetch([id])];
                    case 2:
                        response = _a.sent();
                        if (!response.records[id]) {
                            return [2 /*return*/, null];
                        }
                        record = response.records[id];
                        return [2 /*return*/, {
                                id: id,
                                vector: Array.isArray(record.values) ? record.values : [],
                                metadata: record.metadata || {}
                            }];
                    case 3:
                        error_4 = _a.sent();
                        console.error("\u83B7\u53D6\u5411\u91CF\u5931\u8D25(ID: ".concat(id, "):"), error_4);
                        throw new Error("\u83B7\u53D6\u5411\u91CF\u5931\u8D25: ".concat(error_4.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 向量相似度搜索
     * @param params 搜索参数
     * @returns 相似向量列表
     */
    PineconeClient.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var topK, minScore, indexType, index, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        // 参数验证
                        if (!params.vector || !Array.isArray(params.vector) || params.vector.length === 0) {
                            throw new Error('搜索向量不能为空');
                        }
                        if (params.vector.length !== this.defaultVectorDimension) {
                            console.warn("\u641C\u7D22\u5411\u91CF\u7EF4\u5EA6(".concat(params.vector.length, ")\u4E0E\u9ED8\u8BA4\u7EF4\u5EA6(").concat(this.defaultVectorDimension, ")\u4E0D\u7B26"));
                        }
                        topK = Math.min(Math.max(1, params.topK || 10), 10000);
                        minScore = params.minScore || 0;
                        indexType = params.indexType || types_1.PineconeIndexType.JOB;
                        index = this.getIndex(indexType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, index.query({
                                vector: params.vector,
                                topK: topK,
                                filter: params.filter || {},
                                includeMetadata: true,
                            })];
                    case 2:
                        response = _a.sent();
                        // 过滤低于阈值的结果
                        return [2 /*return*/, response.matches
                                .filter(function (match) { return !minScore || (typeof match.score === 'number' && match.score >= minScore); })
                                .map(function (match) { return ({
                                id: match.id,
                                score: match.score || 0,
                                metadata: match.metadata || {}
                            }); })];
                    case 3:
                        error_5 = _a.sent();
                        console.error("\u5411\u91CF\u641C\u7D22\u5931\u8D25(".concat(indexType, "\u7D22\u5F15):"), error_5);
                        throw new Error("\u5411\u91CF\u641C\u7D22\u5931\u8D25: ".concat(error_5.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 删除向量
     * @param id 向量ID
     */
    PineconeClient.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var indexType, index, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        if (!id) {
                            throw new Error('向量ID不能为空');
                        }
                        indexType = this.getIndexTypeFromId(id);
                        index = this.getIndex(indexType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, index.deleteOne(id)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error("\u5220\u9664\u5411\u91CF\u5931\u8D25(ID: ".concat(id, "):"), error_6);
                        throw new Error("\u5220\u9664\u5411\u91CF\u5931\u8D25: ".concat(error_6.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 批量删除向量
     * @param ids 向量ID列表
     */
    PineconeClient.batchDelete = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var jobIds, resumeIds, invalidIds, deletePromises, jobIndex, resumeIndex, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        if (!ids || ids.length === 0) {
                            console.warn('批量删除向量ID列表为空');
                            return [2 /*return*/];
                        }
                        jobIds = [];
                        resumeIds = [];
                        invalidIds = [];
                        ids.forEach(function (id) {
                            if (id.startsWith('job_')) {
                                jobIds.push(id);
                            }
                            else if (id.startsWith('resume_')) {
                                resumeIds.push(id);
                            }
                            else {
                                invalidIds.push(id);
                            }
                        });
                        if (invalidIds.length > 0) {
                            console.warn("\u53D1\u73B0 ".concat(invalidIds.length, " \u4E2A\u683C\u5F0F\u4E0D\u7B26\u5408\u89C4\u8303\u7684ID\uFF0C\u8FD9\u4E9BID\u5C06\u88AB\u8DF3\u8FC7:"), invalidIds);
                        }
                        deletePromises = [];
                        // 删除岗位向量
                        if (jobIds.length > 0) {
                            jobIndex = this.getIndex(types_1.PineconeIndexType.JOB);
                            deletePromises.push(jobIndex.deleteMany(__spreadArray([], jobIds, true))
                                .catch(function (error) {
                                console.error("\u6279\u91CF\u5220\u9664\u5C97\u4F4D\u5411\u91CF\u5931\u8D25(".concat(jobIds.length, "\u6761):"), error);
                                throw error;
                            }));
                        }
                        // 删除简历向量
                        if (resumeIds.length > 0) {
                            resumeIndex = this.getIndex(types_1.PineconeIndexType.RESUME);
                            deletePromises.push(resumeIndex.deleteMany(__spreadArray([], resumeIds, true))
                                .catch(function (error) {
                                console.error("\u6279\u91CF\u5220\u9664\u7B80\u5386\u5411\u91CF\u5931\u8D25(".concat(resumeIds.length, "\u6761):"), error);
                                throw error;
                            }));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(deletePromises)];
                    case 2:
                        _a.sent();
                        console.log("\u6279\u91CF\u5220\u9664\u5B8C\u6210\uFF0C\u6210\u529F\u5904\u7406 ".concat(jobIds.length, " \u6761\u5C97\u4F4D\u5411\u91CF\u548C ").concat(resumeIds.length, " \u6761\u7B80\u5386\u5411\u91CF"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.error('批量删除过程中发生错误:', error_7);
                        throw new Error("\u6279\u91CF\u5220\u9664\u5931\u8D25: ".concat(error_7.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取索引统计信息
     * @param indexType 索引类型
     * @returns 索引统计信息
     */
    PineconeClient.describeIndexStats = function () {
        return __awaiter(this, arguments, void 0, function (indexType) {
            var index, status_1, error_8;
            if (indexType === void 0) { indexType = types_1.PineconeIndexType.JOB; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkInitialized();
                        index = this.getIndex(indexType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, index.describeIndexStats()];
                    case 2:
                        status_1 = _a.sent();
                        return [2 /*return*/, status_1];
                    case 3:
                        error_8 = _a.sent();
                        console.error("\u83B7\u53D6\u7D22\u5F15\u7EDF\u8BA1\u4FE1\u606F\u5931\u8D25(".concat(indexType, "\u7D22\u5F15):"), error_8);
                        throw new Error("\u83B7\u53D6\u7D22\u5F15\u7EDF\u8BA1\u4FE1\u606F\u5931\u8D25: ".concat(error_8.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PineconeClient.client = null;
    PineconeClient.jobIndexName = null;
    PineconeClient.jobIndexHost = null;
    PineconeClient.resumeIndexName = null;
    PineconeClient.resumeIndexHost = null;
    PineconeClient.isInitialized = false;
    PineconeClient.defaultVectorDimension = 1024; // 默认向量维度
    return PineconeClient;
}());
exports.PineconeClient = PineconeClient;
