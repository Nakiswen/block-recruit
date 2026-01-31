# Requirements Document

## Introduction

本文档定义了 BlockRecruit 平台简历与岗位匹配度优化功能的需求。当前系统存在以下核心问题：
1. SmartFilterBuilder 未被实际使用，向量搜索是"裸搜"
2. 简历和岗位的 Pinecone metadata 字段名不一致（简历用 `skills`，岗位用 `parsed_required_skills`）
3. Embedding 文本被大段描述性内容稀释，影响向量质量
4. 技能标准化不足，未处理同义词（如 React = ReactJS = React.js）
5. 岗位类型覆盖不全，仅覆盖技术岗

本功能旨在通过技能标准化、统一标签结构、优化 Embedding 文本格式、以及实现硬性过滤+向量召回+标签精排的匹配流程来提升匹配准确度。

## Glossary

- **Skill_Normalizer**: 技能标准化服务，负责将不同表述的技能映射为统一的标准格式
- **Unified_Tags**: 统一标签结构，定义简历和岗位共用的标签类型
- **Unified_Metadata**: 统一的 Pinecone 元数据结构，确保简历和岗位使用相同的字段名
- **Matching_Service**: 匹配服务，实现硬性过滤、向量召回、标签精排的完整匹配流程
- **RAG_Service**: 检索增强生成服务，负责向量存储和检索
- **AI_Service**: AI 服务，负责从简历和岗位中提取结构化信息
- **Pinecone_Client**: Pinecone 向量数据库客户端
- **Hard_Filter**: 硬性过滤，基于必须满足的条件（如经验年限、必须技能）进行过滤
- **Vector_Recall**: 向量召回，基于向量相似度检索候选结果
- **Tag_Rerank**: 标签精排，基于技能匹配度、经验匹配度等进行重新排序

## Requirements

### Requirement 1: 技能标准化

**User Story:** As a 系统, I want 将不同表述的技能标准化为统一格式, so that 可以进行精确的技能匹配。

#### Acceptance Criteria

1. WHEN Skill_Normalizer 接收到一个技能名称 THEN THE Skill_Normalizer SHALL 返回该技能的标准化名称
2. WHEN Skill_Normalizer 接收到一个技能的同义词（如 "ReactJS"、"React.js"） THEN THE Skill_Normalizer SHALL 返回统一的标准名称（如 "React"）
3. THE Skill_Normalizer SHALL 支持以下技能分类：编程语言、区块链开发、前端框架、后端框架、数据库、云服务、产品管理、运营、市场营销、设计、研究分析
4. THE Skill_Normalizer SHALL 覆盖 Web3 行业全岗位类型的技能词汇，包括但不限于：Solidity、Rust、Go、TypeScript、React、Vue、Node.js、DeFi、NFT、DAO、智能合约、代币经济学、社区运营、增长黑客
5. WHEN Skill_Normalizer 接收到中文技能名称 THEN THE Skill_Normalizer SHALL 能够正确映射到对应的标准名称
6. WHEN Skill_Normalizer 接收到英文技能名称 THEN THE Skill_Normalizer SHALL 能够正确映射到对应的标准名称
7. WHEN Skill_Normalizer 接收到一个技能名称 THEN THE Skill_Normalizer SHALL 返回该技能所属的分类

### Requirement 2: 统一标签结构

**User Story:** As a 系统, I want 简历和岗位使用统一的标签结构, so that 可以进行一致的过滤和匹配。

#### Acceptance Criteria

1. THE Unified_Tags 类型 SHALL 包含以下字段：normalized_skills（标准化技能列表）、skill_categories（技能分类）、experience_years（经验年限）、education_level（学历）、job_type（岗位类型）、location（地点）
2. THE Unified_Metadata 类型 SHALL 定义 Pinecone 存储所需的所有字段，且简历和岗位使用相同的字段名
3. WHEN 存储简历向量到 Pinecone THEN THE RAG_Service SHALL 使用 Unified_Metadata 格式
4. WHEN 存储岗位向量到 Pinecone THEN THE RAG_Service SHALL 使用 Unified_Metadata 格式
5. THE Unified_Metadata SHALL 包含 normalized_skills 字段用于存储标准化后的技能列表

### Requirement 3: 增强标签提取

**User Story:** As a 系统, I want 使用 LLM 从简历和岗位中提取细粒度的标签, so that 可以获得更准确的结构化数据。

#### Acceptance Criteria

1. WHEN AI_Service 处理简历 THEN THE AI_Service SHALL 提取并返回分类后的技能列表
2. WHEN AI_Service 处理岗位 THEN THE AI_Service SHALL 提取并返回分类后的必须技能和加分技能
3. WHEN AI_Service 提取技能后 THEN THE AI_Service SHALL 调用 Skill_Normalizer 对技能进行标准化处理
4. WHEN AI_Service 处理岗位 THEN THE AI_Service SHALL 提取岗位类型（技术、产品、运营、市场、设计、研究等）
5. WHEN AI_Service 处理简历 THEN THE AI_Service SHALL 提取求职者的目标岗位类型

### Requirement 4: 优化 Embedding 文本

**User Story:** As a 系统, I want 优化用于生成向量的文本格式, so that 可以提高向量质量和匹配准确度。

#### Acceptance Criteria

1. WHEN RAG_Service 格式化简历用于 Embedding THEN THE RAG_Service SHALL 将标准化技能放在文本最前面
2. WHEN RAG_Service 格式化岗位用于 Embedding THEN THE RAG_Service SHALL 将必须技能放在文本最前面
3. WHEN RAG_Service 格式化文本用于 Embedding THEN THE RAG_Service SHALL 限制描述性内容的长度，优先保留关键信息
4. WHEN RAG_Service 格式化文本用于 Embedding THEN THE RAG_Service SHALL 使用结构化格式（如 "技能: xxx, 经验: xxx"）而非自然语言段落
5. THE RAG_Service SHALL 将 Embedding 文本长度控制在 4000 字符以内

### Requirement 5: 改进匹配流程

**User Story:** As a 系统, I want 实现硬性过滤+向量召回+标签精排的匹配流程, so that 可以提高匹配的准确度和效率。

#### Acceptance Criteria

1. WHEN Matching_Service 执行匹配 THEN THE Matching_Service SHALL 首先应用硬性过滤条件
2. THE Hard_Filter SHALL 支持按经验年限过滤（求职者经验 >= 岗位要求）
3. THE Hard_Filter SHALL 支持按必须技能过滤（求职者技能包含岗位必须技能）
4. WHEN 硬性过滤后 THEN THE Matching_Service SHALL 执行向量召回，召回数量应大于最终返回数量（如召回 50 个，返回 10 个）
5. WHEN 向量召回后 THEN THE Matching_Service SHALL 执行标签精排
6. THE Tag_Rerank SHALL 计算技能匹配度分数（匹配技能数 / 必须技能数）
7. THE Tag_Rerank SHALL 计算经验匹配度分数
8. THE Tag_Rerank SHALL 计算薪资匹配度分数
9. THE Tag_Rerank SHALL 使用加权公式计算最终分数：技能匹配度 * 0.4 + 向量相似度 * 0.25 + 经验匹配度 * 0.2 + 薪资匹配度 * 0.15
10. IF 硬性过滤结果为空 THEN THE Matching_Service SHALL 放宽过滤条件并重试
11. WHEN 放宽过滤条件 THEN THE Matching_Service SHALL 按优先级依次放宽：先放宽经验年限要求（-1年），再放宽必须技能要求（允许缺少1个）

### Requirement 6: 整合到现有流程

**User Story:** As a 系统, I want 将新的匹配服务整合到现有的 RAG_Service 中, so that 可以无缝升级匹配能力。

#### Acceptance Criteria

1. THE RAG_Service SHALL 新增 processResumeAndFindMatchesV2 方法，使用新的匹配流程
2. THE RAG_Service SHALL 新增 processJobV2 方法，使用新的标签提取和向量化流程
3. THE RAG_Service SHALL 保持现有的 processResumeAndFindMatches 和 processJob 方法不变，确保向后兼容
4. WHEN 调用 processResumeAndFindMatchesV2 THEN THE RAG_Service SHALL 使用 Matching_Service 执行匹配
5. WHEN 调用 processJobV2 THEN THE RAG_Service SHALL 使用 Skill_Normalizer 标准化技能并使用 Unified_Metadata 存储向量
