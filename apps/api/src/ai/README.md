# AI 服务模块

本模块提供了基于LangChain和OpenRouter的AI服务，用于处理简历和岗位匹配相关的任务。

## 功能

- **岗位信息提取**：从岗位描述中提取结构化信息，包括必备技能、加分技能、经验要求等
- **简历信息提取**：从简历中提取结构化信息，包括技能、工作经验、学历等
- **匹配度计算**：基于简历和岗位信息，计算匹配度评分和提供改进建议

## 配置

### 环境变量

在项目根目录的`.env`文件中配置以下环境变量：

```
# OpenRouter API配置
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=anthropic/claude-sonnet-4
AI_API_BASE_URL=https://openrouter.ai/api/v1
```

### 可用的模型

通过OpenRouter，可以使用多种大型语言模型，包括：

- `anthropic/claude-sonnet-4` - Claude 4 Sonnet (推荐)
- `anthropic/claude-3-7-sonnet` - Claude 3.7 Sonnet
- `anthropic/claude-3-5-sonnet` - Claude 3.5 Sonnet
- `openai/gpt-4o` - GPT-4o

## 使用示例

```typescript
import { aiService } from '@/ai/aiService';
import { Job, Resume } from '@/rag/types';

// 提取岗位信息
const job: Job = {
  title: '高级前端工程师',
  companyName: '区块链招聘',
  description: '...',
  responsibilities: '...',
  requirements: '...'
};
const jobInfo = await aiService.extractJobInfo(job);

// 提取简历信息
const resume: Resume = {
  name: '张三',
  summary: '...',
  workExperience: '...',
  projects: '...',
  education: '...',
  skills: ['React', 'TypeScript', 'Web3.js']
};
const resumeInfo = await aiService.extractResumeInfo(resume);

// 计算匹配度
const matchResult = await aiService.calculateMatchScore(resumeInfo, jobInfo);
console.log(`匹配度: ${matchResult.score * 100}%`);
console.log(`匹配的技能: ${matchResult.matchedSkills.join(', ')}`);
console.log(`缺失的技能: ${matchResult.missingSkills.join(', ')}`);
```

## 依赖

- `@langchain/openai` - LangChain OpenAI集成
- `@langchain/core` - LangChain核心组件
- `zod` - 用于数据验证和类型转换 