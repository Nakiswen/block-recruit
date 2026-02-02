# Implementation Plan: 简历与岗位匹配度优化

## Overview

本实现计划将设计文档中的架构和组件转化为具体的编码任务。采用增量开发方式，从基础组件开始，逐步构建完整的匹配优化功能。

## Tasks

- [x] 1. 实现技能标准化服务 (Skill Normalizer)
  - [x] 1.1 创建 skillNormalizer.ts 文件，定义 SkillCategory 枚举和接口
    - 创建 `apps/api/src/services/rag/skillNormalizer.ts`
    - 定义 SkillCategory 枚举（13 个分类）
    - 定义 NormalizedSkill 接口和 ISkillNormalizer 接口
    - _Requirements: 1.1, 1.3_

  - [x] 1.2 实现技能同义词映射表
    - 创建 SKILL_SYNONYMS 常量，包含 Web3 行业全岗位类型的技能同义词
    - 覆盖编程语言、区块链、前端、后端、数据库、云服务、DevOps、产品、运营、市场、设计、研究等分类
    - 支持中英文同义词映射
    - _Requirements: 1.2, 1.4, 1.5, 1.6_

  - [x] 1.3 实现技能分类映射表
    - 创建 SKILL_CATEGORIES 常量，将技能映射到对应分类
    - 确保每个分类都有代表性技能
    - _Requirements: 1.3, 1.7_

  - [x] 1.4 实现 SkillNormalizer 类的核心方法
    - 实现 normalize(skill: string): NormalizedSkill
    - 实现 normalizeMany(skills: string[]): NormalizedSkill[]
    - 实现 getCategory(skill: string): SkillCategory
    - 实现 areEquivalent(skill1: string, skill2: string): boolean
    - 实现 getAliases(skill: string): string[]
    - _Requirements: 1.1, 1.2, 1.7_

  - [x] 1.5 编写 Skill Normalizer 属性测试
    - **Property 1: 技能同义词等价性**
    - **Property 2: 技能分类一致性**
    - **Validates: Requirements 1.1, 1.2, 1.5, 1.6, 1.7**

- [x] 2. 扩展类型定义 (Unified Types)
  - [x] 2.1 在 types.ts 中添加统一类型定义
    - 添加 JobType 枚举
    - 添加 UnifiedTags 接口
    - 添加 UnifiedMetadata 接口
    - 确保简历和岗位使用相同的字段名
    - _Requirements: 2.1, 2.2, 2.5_

- [x] 3. Checkpoint - 确保基础类型和服务正常
  - 运行现有测试确保没有破坏性更改
  - 确保 TypeScript 编译通过
  - 如有问题请询问用户

- [x] 4. 实现匹配服务 (Matching Service)
  - [x] 4.1 创建 matchingService.ts 文件，定义接口和配置
    - 创建 `apps/api/src/services/rag/matchingService.ts`
    - 定义 MatchingConfig 接口
    - 定义 MatchingResult 接口
    - 定义 IMatchingService 接口
    - 定义 DEFAULT_MATCHING_CONFIG 常量
    - _Requirements: 5.1, 5.9_

  - [x] 4.2 实现硬性过滤方法
    - 实现 buildHardFilters 方法
    - 支持经验年限过滤（求职者经验 >= 岗位要求）
    - 支持必须技能过滤
    - 集成 SmartFilterBuilder
    - _Requirements: 5.2, 5.3_

  - [x] 4.3 实现标签精排方法
    - 实现 rerankByTags 方法
    - 计算技能匹配度分数（匹配技能数 / 必须技能数）
    - 计算经验匹配度分数
    - 计算薪资匹配度分数
    - 使用加权公式计算最终分数
    - _Requirements: 5.6, 5.7, 5.8, 5.9_

  - [x] 4.4 实现过滤放宽逻辑
    - 实现过滤条件放宽策略
    - 先放宽经验年限要求（-1年）
    - 再放宽必须技能要求（允许缺少1个）
    - _Requirements: 5.10, 5.11_

  - [x] 4.5 实现完整匹配流程
    - 实现 findMatchingJobsForResume 方法
    - 实现 findMatchingResumesForJob 方法
    - 整合硬性过滤、向量召回、标签精排三阶段
    - _Requirements: 5.1, 5.4, 5.5_

  - [x] 4.6 编写 Matching Service 属性测试
    - **Property 7: 硬性过滤经验条件**
    - **Property 8: 硬性过滤技能条件**
    - **Property 9: 精排分数有效范围**
    - **Property 10: 精排加权公式正确性**
    - **Property 11: 过滤放宽有效性**
    - **Validates: Requirements 5.2, 5.3, 5.6, 5.7, 5.8, 5.9, 5.10**

- [x] 5. Checkpoint - 确保匹配服务正常
  - 运行匹配服务相关测试
  - 确保 TypeScript 编译通过
  - 如有问题请询问用户

- [x] 6. 扩展 AI Service
  - [x] 6.1 添加增强版简历信息提取方法
    - 在 aiService.ts 中添加 extractResumeInfoEnhanced 方法
    - 提取分类后的技能列表
    - 调用 SkillNormalizer 进行标准化
    - 提取目标岗位类型
    - _Requirements: 3.1, 3.3, 3.5_

  - [x] 6.2 添加增强版岗位信息提取方法
    - 在 aiService.ts 中添加 extractJobInfoEnhanced 方法
    - 提取分类后的必须技能和加分技能
    - 调用 SkillNormalizer 进行标准化
    - 提取岗位类型
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 6.3 编写 AI Service 增强方法属性测试
    - **Property 4: AI 提取技能标准化**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 7. 扩展 RAG Service
  - [x] 7.1 添加 V2 版本 Embedding 文本格式化方法
    - 实现 formatResumeForEmbeddingV2 方法
    - 实现 formatJobForEmbeddingV2 方法
    - 标准化技能放在文本最前面
    - 使用结构化格式
    - 限制文本长度在 4000 字符以内
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 7.2 编写 Embedding 格式化属性测试
    - **Property 5: Embedding 文本技能优先**
    - **Property 6: Embedding 文本长度限制**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

  - [x] 7.3 添加 processJobV2 方法
    - 使用 extractJobInfoEnhanced 提取信息
    - 使用 formatJobForEmbeddingV2 格式化文本
    - 使用 UnifiedMetadata 格式存储向量
    - _Requirements: 6.2, 6.5_

  - [x] 7.4 添加 processResumeAndFindMatchesV2 方法
    - 使用 extractResumeInfoEnhanced 提取信息
    - 使用 formatResumeForEmbeddingV2 格式化文本
    - 使用 MatchingService 执行匹配
    - 使用 UnifiedMetadata 格式存储向量
    - _Requirements: 6.1, 6.4_

  - [x] 7.5 编写 RAG Service V2 属性测试
    - **Property 3: Metadata 格式一致性**
    - **Property 12: 向后兼容性**
    - **Validates: Requirements 2.3, 2.4, 6.3**

- [x] 8. Checkpoint - 确保所有 V2 方法正常
  - 运行所有测试确保通过
  - 确保 TypeScript 编译通过
  - 验证向后兼容性
  - 如有问题请询问用户

- [x] 9. 集成测试和文档
  - [x] 9.1 编写端到端集成测试
    - 测试完整的 processResumeAndFindMatchesV2 流程
    - 测试完整的 processJobV2 流程
    - 验证匹配结果的准确性
    - _Requirements: 6.1, 6.2_

  - [x] 9.2 更新 API 文档
    - 更新 Swagger 注释
    - 添加 V2 方法的使用说明
    - _Requirements: 6.3_

- [x] 10. Final Checkpoint - 确保所有测试通过
  - 运行完整测试套件
  - 确保代码质量符合规范
  - 如有问题请询问用户

## Notes

- 任务标记 `*` 的为可选任务（属性测试），可根据时间安排决定是否实现
- 每个任务都引用了具体的需求编号，确保可追溯性
- Checkpoint 任务用于阶段性验证，确保增量开发的稳定性
- 属性测试使用 fast-check 库，每个测试运行至少 100 次迭代
- 所有新增代码需要遵循项目的 TypeScript 严格模式，禁止使用 `any` 类型
