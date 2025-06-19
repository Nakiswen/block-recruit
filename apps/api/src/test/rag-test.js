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
var ragService_1 = require("../rag/ragService");
var client_1 = require("../prisma/client");
var dotenv_1 = require("dotenv");
// 加载环境变量
dotenv_1.default.config();
/**
 * 测试RAG服务 - 将PostgreSQL中的岗位数据转换为Pinecone向量
 */
function testRagService() {
    return __awaiter(this, void 0, void 0, function () {
        var jobs, jobIds, result, testJobId, jobVector, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 9]);
                    console.log('开始初始化RAG服务...');
                    return [4 /*yield*/, ragService_1.ragService.init()];
                case 1:
                    _a.sent();
                    console.log('RAG服务初始化成功');
                    // 获取岗位数据 (限制5条用于测试)
                    console.log('从PostgreSQL获取岗位数据...');
                    return [4 /*yield*/, client_1.jobsPrisma.job_posting.findMany({
                            take: 5,
                            orderBy: {
                                created_time: 'desc'
                            }
                        })];
                case 2:
                    jobs = _a.sent();
                    if (!jobs || jobs.length === 0) {
                        console.log('没有找到岗位数据');
                        return [2 /*return*/];
                    }
                    console.log("\u83B7\u53D6\u5230 ".concat(jobs.length, " \u6761\u5C97\u4F4D\u6570\u636E"));
                    jobIds = jobs.map(function (job) { return job.topic_id.toString(); });
                    console.log('岗位ID列表:', jobIds);
                    // 处理岗位数据，生成向量
                    console.log('开始处理岗位数据，生成向量...');
                    return [4 /*yield*/, ragService_1.ragService.processJobs(jobIds)];
                case 3:
                    result = _a.sent();
                    console.log('处理结果统计:');
                    console.log("- \u603B\u6570: ".concat(result.total));
                    console.log("- \u6210\u529F: ".concat(result.success));
                    console.log("- \u5931\u8D25: ".concat(result.failed));
                    if (result.errors.length > 0) {
                        console.log('错误信息:');
                        result.errors.forEach(function (error) { return console.log("  - ".concat(error)); });
                    }
                    if (!(result.success > 0)) return [3 /*break*/, 5];
                    testJobId = jobIds[0];
                    console.log("\n\u6D4B\u8BD5\u68C0\u7D22\u5C97\u4F4D\u5411\u91CF (ID: ".concat(testJobId, ")..."));
                    return [4 /*yield*/, ragService_1.ragService.getJobVector(testJobId)];
                case 4:
                    jobVector = _a.sent();
                    if (jobVector) {
                        console.log('成功检索到岗位向量:');
                        console.log("- ID: ".concat(jobVector.id));
                        console.log("- \u5411\u91CF\u7EF4\u5EA6: ".concat(jobVector.vector.length));
                        console.log('- 元数据:', JSON.stringify(jobVector.metadata, null, 2));
                    }
                    else {
                        console.log('未找到岗位向量');
                    }
                    _a.label = 5;
                case 5:
                    console.log('\nRAG服务测试完成');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('测试过程中发生错误:', error_1);
                    return [3 /*break*/, 9];
                case 7: 
                // 关闭Prisma连接
                return [4 /*yield*/, client_1.jobsPrisma.$disconnect()];
                case 8:
                    // 关闭Prisma连接
                    _a.sent();
                    process.exit(0);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// 执行测试
testRagService();
