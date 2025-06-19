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
exports.embeddingService = void 0;
var axios_1 = require("axios");
var inference_1 = require("@huggingface/inference");
/**
 * 向量嵌入服务
 * 负责生成文本的向量表示
 */
var EmbeddingService = /** @class */ (function () {
    function EmbeddingService(config) {
        this.hf = null;
        this.config = config;
        this.cache = new Map();
        // 初始化HuggingFace客户端（如果提供了HF API密钥）
        if (this.config.hfApiKey) {
            this.hf = new inference_1.HfInference(this.config.hfApiKey);
        }
    }
    /**
     * 生成文本的向量表示
     * @param text 输入文本
     * @returns 向量数组
     */
    EmbeddingService.prototype.generateEmbedding = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedText, cacheKey, cachedVector, vector, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        normalizedText = this.normalizeText(text);
                        cacheKey = this.generateCacheKey(normalizedText);
                        cachedVector = this.cache.get(cacheKey);
                        if (cachedVector) {
                            return [2 /*return*/, cachedVector];
                        }
                        return [4 /*yield*/, this.callEmbeddingAPI(normalizedText)];
                    case 1:
                        vector = _a.sent();
                        // 存入缓存
                        this.cache.set(cacheKey, vector);
                        return [2 /*return*/, vector];
                    case 2:
                        error_1 = _a.sent();
                        console.error('生成向量失败:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 批量生成向量
     * @param texts 文本列表
     * @returns 向量数组列表
     */
    EmbeddingService.prototype.batchGenerateEmbeddings = function (texts) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedTexts, results, textsToEmbed, indices, i, text, cacheKey, cachedVector, vectors, i, text, vector, cacheKey, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 检查是否有文本需要处理
                        if (!texts.length) {
                            return [2 /*return*/, []];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        normalizedTexts = texts.map(function (text) { return _this.normalizeText(text); });
                        results = [];
                        textsToEmbed = [];
                        indices = [];
                        for (i = 0; i < normalizedTexts.length; i++) {
                            text = normalizedTexts[i];
                            cacheKey = this.generateCacheKey(text);
                            cachedVector = this.cache.get(cacheKey);
                            if (cachedVector) {
                                results[i] = cachedVector;
                            }
                            else {
                                textsToEmbed.push(text);
                                indices.push(i);
                            }
                        }
                        // 如果所有文本都在缓存中，直接返回
                        if (!textsToEmbed.length) {
                            return [2 /*return*/, results];
                        }
                        return [4 /*yield*/, this.callBatchEmbeddingAPI(textsToEmbed)];
                    case 2:
                        vectors = _a.sent();
                        // 存入缓存并填充结果
                        for (i = 0; i < vectors.length; i++) {
                            text = textsToEmbed[i];
                            vector = vectors[i];
                            cacheKey = this.generateCacheKey(text);
                            this.cache.set(cacheKey, vector);
                            results[indices[i]] = vector;
                        }
                        return [2 /*return*/, results];
                    case 3:
                        error_2 = _a.sent();
                        console.error('批量生成向量失败:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 计算两个向量之间的余弦相似度
     * @param vector1 向量1
     * @param vector2 向量2
     * @returns 余弦相似度 (0-1之间)
     */
    EmbeddingService.prototype.calculateCosineSimilarity = function (vector1, vector2) {
        if (vector1.length !== vector2.length) {
            throw new Error('向量维度不匹配');
        }
        var dotProduct = 0;
        var magnitude1 = 0;
        var magnitude2 = 0;
        for (var i = 0; i < vector1.length; i++) {
            dotProduct += vector1[i] * vector2[i];
            magnitude1 += vector1[i] * vector1[i];
            magnitude2 += vector2[i] * vector2[i];
        }
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);
        if (magnitude1 === 0 || magnitude2 === 0) {
            return 0;
        }
        return dotProduct / (magnitude1 * magnitude2);
    };
    /**
     * 清除缓存
     */
    EmbeddingService.prototype.clearCache = function () {
        this.cache.clear();
    };
    /**
     * 调用Embedding API生成向量
     * @param text 输入文本
     * @returns 向量数组
     */
    EmbeddingService.prototype.callEmbeddingAPI = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var apiUrl, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.config.modelName === 'BAAI/bge-large-en-v1.5-icl' && this.hf)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.callHuggingFaceEmbedding(text)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        apiUrl = this.config.apiKey.includes('sk-zpmodel')
                            ? 'https://api.zhipuai.cn/v1/embeddings'
                            : 'https://api.openai.com/v1/embeddings';
                        return [4 /*yield*/, axios_1.default.post(apiUrl, {
                                model: this.config.modelName,
                                input: text
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(this.config.apiKey)
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data[0].embedding];
                    case 4:
                        error_3 = _a.sent();
                        console.error('调用Embedding API失败:', error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 调用HuggingFace Embedding API
     * @param text 输入文本
     * @returns 向量数组
     */
    EmbeddingService.prototype.callHuggingFaceEmbedding = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var result, resultObj, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.hf) {
                            throw new Error('HuggingFace客户端未初始化，请提供有效的HF API密钥');
                        }
                        return [4 /*yield*/, this.hf.featureExtraction({
                                model: 'BAAI/bge-large-en-v1.5-icl',
                                inputs: text,
                                // ICL提示模板，根据模型文档添加
                                options: {
                                    use_pooling: true,
                                    wait_for_model: true
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        // 返回特征向量
                        if (Array.isArray(result)) {
                            // 如果返回的是数组
                            if (result.length > 0 && !Array.isArray(result[0])) {
                                // 如果是一维数组，直接返回
                                return [2 /*return*/, result];
                            }
                            else if (result.length > 0 && Array.isArray(result[0])) {
                                // 如果是二维数组，返回第一个元素
                                return [2 /*return*/, result[0]];
                            }
                        }
                        else if (typeof result === 'object' && result !== null) {
                            resultObj = result;
                            if ('embeddings' in resultObj && Array.isArray(resultObj.embeddings)) {
                                return [2 /*return*/, resultObj.embeddings];
                            }
                        }
                        // 如果无法正确解析，返回空数组并记录错误
                        console.error('无法解析HuggingFace返回的embedding结果:', result);
                        return [2 /*return*/, []];
                    case 2:
                        error_4 = _a.sent();
                        console.error('调用HuggingFace Embedding API失败:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 批量调用Embedding API生成向量
     * @param texts 文本列表
     * @returns 向量数组列表
     */
    EmbeddingService.prototype.callBatchEmbeddingAPI = function (texts) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, apiUrl, response, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.config.modelName === 'BAAI/bge-large-en-v1.5-icl' && this.hf)) return [3 /*break*/, 2];
                        promises = texts.map(function (text) { return _this.callHuggingFaceEmbedding(text); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        apiUrl = this.config.apiKey.includes('sk-zpmodel')
                            ? 'https://api.zhipuai.cn/v1/embeddings'
                            : 'https://api.openai.com/v1/embeddings';
                        return [4 /*yield*/, axios_1.default.post(apiUrl, {
                                model: this.config.modelName,
                                input: texts
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': "Bearer ".concat(this.config.apiKey)
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        // API返回的向量数组可能不是按输入顺序排列的，需要根据index排序
                        return [2 /*return*/, response.data.data
                                .sort(function (a, b) { return a.index - b.index; })
                                .map(function (item) { return item.embedding; })];
                    case 4:
                        error_5 = _a.sent();
                        console.error('批量调用Embedding API失败:', error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 生成缓存键
     * @param text 文本
     * @returns 缓存键
     */
    EmbeddingService.prototype.generateCacheKey = function (text) {
        // 简单的缓存键生成，实际项目中可以使用更复杂的哈希函数
        return "".concat(this.config.modelName, ":").concat(text.substring(0, 100));
    };
    /**
     * 对文本进行归一化处理
     * @param text 原始文本
     * @returns 归一化后的文本
     */
    EmbeddingService.prototype.normalizeText = function (text) {
        if (!text)
            return '';
        // 去除多余空白字符
        var normalized = text.replace(/\s+/g, ' ').trim();
        // 针对BAAI/bge-large-en-v1.5-icl模型，添加特定的文本处理
        if (this.config.modelName === 'BAAI/bge-large-en-v1.5-icl') {
            // 对于bge-large-en-v1.5-icl，按照文档建议添加查询前缀
            if (!normalized.startsWith('Represent this sentence for searching:') && normalized.length < 5000) {
                normalized = "Represent this sentence for searching: ".concat(normalized);
            }
        }
        // 如果文本过长，可以截取一定长度
        var maxLength = 8000; // API的文本长度限制
        if (normalized.length > maxLength) {
            normalized = normalized.substring(0, maxLength);
        }
        return normalized;
    };
    return EmbeddingService;
}());
// 从环境变量获取配置
var config = {
    apiKey: process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY || '',
    hfApiKey: process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY || '',
    modelName: process.env.EMBEDDING_MODEL || 'BAAI/bge-large-en-v1.5-icl',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1024', 10) // BGE模型默认是1024维
};
// 导出服务实例
exports.embeddingService = new EmbeddingService(config);
