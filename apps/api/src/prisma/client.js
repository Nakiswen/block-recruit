"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumePrisma = exports.jobsPrisma = void 0;
var web3jobs_prisma_1 = require("./web3jobs-prisma");
var web3cv_prisma_1 = require("./web3cv-prisma");
// 导出两个不同的Prisma客户端实例
exports.jobsPrisma = web3jobs_prisma_1.default;
exports.resumePrisma = web3cv_prisma_1.default;
