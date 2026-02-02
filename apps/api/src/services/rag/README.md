# RAG 服务模块

本模块提供了基于向量检索的简历与岗位匹配服务，支持技能标准化和智能过滤。

## 模块结构

```
rag/
├── ragService.ts          # 原始 RAG 服务（向后兼容）
├── ragServiceV2.ts        # V2 版本 RAG 服务（推荐使用）
├── matchingService.ts     # 匹配服务（硬性过滤 + 向量召回 + 标签精排）
├── skillNormalizer.ts     # 技能标准化服务
├── embeddingService.ts    # Embedding 生成服务
├── pineconeClient.ts      # Pinecone 向量数据库客户端
├── smartFilterBuilder.ts  # 智能过滤条件构建器
├── extractionService.ts   # 信息提取服务
└── types.ts               # 类型定义
```

## V2 版本新特性

### 1. 技能标准化 (SkillNormalizer)

将不同表述的技能映射为统一的标准格式，支持：

- **13 个技能分类**：编程语言、区块链、前端、后端、数据库、云服务、DevOps、产品、运营、市场、设计、研究、商务
- **中英文同义词映射**：如 "产品经理" → "Product Management"
- **技能等价性判断**：如 "ReactJS" ≡ "React.js" ≡ "React"

```typescript
import { skillNormalizer, SkillCategory } from '@/services/rag/skillNormalizer';

// 标准化单个技能
const result = skillNormalizer.normalize('ReactJS');
// { original: 'ReactJS', normalized: 'React', category: 'frontend', aliases: [...] }

// 批量标准化
const skills = skillNormalizer.normalizeMany(['React', 'TS', '产品经理']);

// 检查技能等价性
skillNormalizer.areEquivalent('ReactJS', 'React.js'); // true

// 推断岗位类型
skillNormalizer.inferJobType(['React', 'TypeScript', 'Node.js']); // 'technical'
```

### 2. 统一标签结构 (UnifiedTags)

简历和岗位使用相同的标签结构，便于匹配计算：

```typescript
interface UnifiedTags {
  normalizedSkills: string[];    // 标准化后的技能列表
  skillCategories: SkillCategory[]; // 技能分类列表
  experienceYears: number;       // 经验年限
  educationLevel: string;        // 学历
  jobType: JobType;              // 岗位类型
  location: string;              // 地点
  industry: string[];            // 行业
}
```

### 3. 三阶段匹配流程 (MatchingService)

```
硬性过滤 → 向量召回 → 标签精排
```

- **硬性过滤**：经验年限、岗位类型等必要条件
- **向量召回**：基于语义相似度的候选召回
- **标签精排**：基于技能匹配度、经验匹配度、薪资匹配度的加权排序

```typescript
import { matchingService } from '@/services/rag/matchingService';

// 为简历查找匹配岗位
const matches = await matchingService.findMatchingJobsForResume(
  resumeTags,
  resumeVector,
  {
    vectorRecallTopK: 50,
    finalTopK: 10,
    weights: {
      skillMatch: 0.4,
      vectorSimilarity: 0.25,
      experienceMatch: 0.2,
      salaryMatch: 0.15,
    },
  }
);
```

### 4. 优化的 Embedding 文本格式

V2 版本的 Embedding 文本格式将技能放在最前面，使用结构化格式：

```
技能: react, typescript, nodejs
技能分类: frontend, programming_language
目标岗位: technical
工作经验: 5年
学历: 本科
地点: 上海
行业经验: 互联网, 区块链
成就: 开发了公司核心产品; 优化了页面性能50%
经历: ...
```

## 使用示例

### 处理简历并查找匹配岗位

```typescript
import { ragServiceV2 } from '@/services/rag/ragServiceV2';

// V2 版本：处理简历并查找匹配岗位
const result = await ragServiceV2.processResumeAndFindMatchesV2(resumeId);

console.log(`找到 ${result.matches.length} 个匹配岗位`);
for (const match of result.matches) {
  console.log(`- ${match.id}: 综合得分 ${match.score.toFixed(2)}`);
  console.log(`  技能匹配: ${match.skillMatchScore.toFixed(2)}`);
  console.log(`  匹配技能: ${match.matchedSkills.join(', ')}`);
  console.log(`  缺失技能: ${match.missingSkills.join(', ')}`);
}
```

### 处理岗位

```typescript
import { ragServiceV2 } from '@/services/rag/ragServiceV2';

// V2 版本：处理岗位
const result = await ragServiceV2.processJobV2(job);

console.log(`向量化${result.vectorizeSuccess ? '成功' : '失败'}`);
console.log(`向量ID: ${result.vectorId}`);
console.log(`标准化技能: ${result.metadata.normalized_skills.join(', ')}`);
```

### 为岗位查找匹配简历

```typescript
import { ragServiceV2 } from '@/services/rag/ragServiceV2';

// V2 版本：为岗位查找匹配简历
const result = await ragServiceV2.findMatchingResumesForJobV2(jobId, 10);

console.log(`找到 ${result.matches.length} 个匹配简历`);
```

## 配置

### 环境变量

```bash
# Pinecone 配置
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_JOB_INDEX_NAME=jobs
PINECONE_JOB_INDEX_HOST=your_job_index_host
PINECONE_RESUME_INDEX_NAME=resumes
PINECONE_RESUME_INDEX_HOST=your_resume_index_host

# Embedding 配置
EMBEDDING_API_KEY=your_embedding_api_key
EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
```

### 匹配配置

```typescript
const DEFAULT_MATCHING_CONFIG = {
  hardFilterEnabled: true,      // 是否启用硬性过滤
  vectorRecallTopK: 50,         // 向量召回数量
  finalTopK: 10,                // 最终返回数量
  minVectorScore: 0.6,          // 最低向量相似度
  relaxFilterOnEmpty: true,     // 空结果时是否放宽过滤
  weights: {
    skillMatch: 0.4,            // 技能匹配权重
    vectorSimilarity: 0.25,     // 向量相似度权重
    experienceMatch: 0.2,       // 经验匹配权重
    salaryMatch: 0.15,          // 薪资匹配权重
  },
};
```

## 向后兼容性

V2 版本与原有 `ragService` 完全兼容：

- 原有的 `processResumeAndFindMatches` 方法仍然可用
- 原有的 `vectorizeAndStoreResume` 方法仍然可用
- 新旧向量可以共存于同一个 Pinecone 索引

## 依赖

- `@pinecone-database/pinecone` - Pinecone 向量数据库客户端
- `@langchain/openai` - LangChain OpenAI 集成（用于 Embedding）
- `ioredis` - Redis 客户端（用于缓存）
