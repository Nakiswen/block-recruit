# Web3 RAG (检索增强生成)

该包提供了基于检索增强生成(RAG)技术的Web3知识库和简历评估功能。它使用向量相似度搜索来匹配简历中的技能与Web3知识库，提供更精准的技能匹配和职业建议。

## 主要功能

1. **Web3知识库管理**：构建和管理Web3和区块链技术相关的知识库
2. **技能匹配与评估**：基于知识库评估简历中的技能与特定Web3职位的匹配度
3. **专业发展建议**：提供基于简历分析的职业发展路径和学习资源推荐

## 技术实现

- 使用文本分块和向量嵌入技术处理知识库内容
- 基于向量相似度搜索匹配简历技能与知识库内容
- 智能评估技能水平、识别缺失的关键技能
- 生成具体且有针对性的职业发展建议

## 使用示例

### 初始化知识库

```typescript
import { Web3KnowledgeManager } from 'web3-rag';

// 创建知识库管理器
const knowledgeManager = new Web3KnowledgeManager(process.env.OPENAI_API_KEY);

// 创建Web3知识库
const knowledgeBase = knowledgeManager.createKnowledgeBase(
  'Web3 Skills Knowledge Base',
  'Web3和区块链相关技能和知识的集合'
);

// 添加内容到知识库
await knowledgeManager.addToKnowledgeBase(
  knowledgeBase.id, 
  '关于Solidity的详细文本...',
  { title: 'Solidity基础概念' }
);
```

### 评估简历

```typescript
import { Web3KnowledgeManager, Web3ResumeEvaluator } from 'web3-rag';
import { ResumeData } from 'resume-parser';

// 创建评估器
const knowledgeManager = new Web3KnowledgeManager();
const evaluator = new Web3ResumeEvaluator(knowledgeManager);

// 评估简历
const evaluation = await evaluator.evaluateResume(
  resumeData,
  jobRequirement
);

console.log(`总体评分: ${evaluation.overallScore}`);
console.log(`匹配技能: ${evaluation.skillMatches.length}`);
console.log(`职业建议: ${evaluation.careerSuggestions}`);
```

## 初始化知识库

运行初始化脚本以创建和填充知识库：

```bash
# 设置OpenAI API密钥
export OPENAI_API_KEY=your-api-key-here

# 运行初始化脚本
ts-node scripts/init-knowledge-base.ts
```

## 注意事项

- 知识库内容目前存储在内存中，实际生产环境应连接向量数据库
- 可以使用实际的OpenAI API生成更精确的嵌入，或使用内置的模拟嵌入功能
- 在未提供API密钥的情况下，将使用简化的相似度计算 