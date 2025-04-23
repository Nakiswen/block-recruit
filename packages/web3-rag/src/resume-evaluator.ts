import { Web3KnowledgeManager } from './knowledge-manager';
import { SkillMatch, EvaluationResult, JobRequirement, LearningResource, Web3KnowledgeBase } from './types';

// 定义ResumeData接口
interface ResumeData {
  skills?: string[];
  workExperience: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    technologies?: string[];
    description?: string;
  }>;
  projects: Array<{
    name?: string;
    role?: string;
    technologies?: string[];
    description?: string;
  }>;
  education: Array<{
    school?: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

/**
 * Web3简历评估器类
 * 使用标准RAG流程进行简历评估
 * 1. 加载知识库
 * 2. 提取简历关键内容
 * 3. 通过向量检索相关知识
 * 4. 使用LLM结合知识评估简历
 */
export class Web3ResumeEvaluator {
  private knowledgeManager: Web3KnowledgeManager;
  private apiKey: string | null;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
    this.knowledgeManager = new Web3KnowledgeManager(apiKey);
  }
  
  /**
   * 评估简历与职位的匹配度
   * @param resumeData - 简历数据
   * @param jobRequirement - 职位要求
   * @returns 评估结果
   */
  async evaluateResume(
    resumeData: ResumeData,
    jobRequirement: JobRequirement
  ): Promise<EvaluationResult> {
    // 1. 提取简历中的技能和经验
    const skills = resumeData.skills || [];
    const extractedSkills = await this.knowledgeManager.extractSkillsFromText(
      [
        ...(resumeData.skills || []),
        ...resumeData.workExperience.map((exp: any) => exp.description || ''),
        ...resumeData.projects.map((proj: any) => proj.description || '')
      ].join(' ')
    );
    
    // 合并并去重提取的技能
    const allSkills = [...new Set([...skills, ...extractedSkills])];
    
    // 2. 分析岗位要求
    const requiredSkills = jobRequirement.skills?.required || [];
    const preferredSkills = jobRequirement.skills?.preferred || [];
    const experienceYears = jobRequirement.experience?.minYears || 0;
    const experienceFields = jobRequirement.experience?.requiredFields || [];
    
    // 3. 获取技能相关知识上下文
    const knowledgeContext = await this.getSkillsContext(allSkills);
    
    // 4. 构建评估提示
    const evaluationPrompt = this.buildEvaluationPrompt(
      resumeData,
      jobRequirement,
      knowledgeContext,
      {
        allSkills,
        requiredSkills,
        preferredSkills,
        experienceYears,
        experienceFields
      }
    );
    
    // 5. 使用OpenRouter API进行评估
    if (!this.apiKey) {
      return this.generateFallbackEvaluation(resumeData, jobRequirement);
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://blockrecruitment.com',
          'X-Title': 'Block Recruitment App'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的Web3人才评估专家，擅长评估候选人的技能、经验与职位要求的匹配度。请以JSON格式返回评估结果。'
            },
            {
              role: 'user',
              content: evaluationPrompt
            }
          ],
          temperature: 0.2
        })
      });
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`);
      }
      
      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('API返回内容为空');
      }
      
      // 解析响应内容
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('返回内容中未找到JSON');
        }
        
        const parsedResult = JSON.parse(jsonMatch[0]);
        
        // 确保格式正确并提供默认值
        return {
          skillMatches: parsedResult.skillMatches || [],
          missingSkills: parsedResult.missingSkills || [],
          strengthAreas: parsedResult.strengthAreas || [],
          improvementAreas: parsedResult.improvementAreas || [],
          careerSuggestions: parsedResult.careerSuggestions || [],
          learningResources: parsedResult.learningResources || []
        };
      } catch (parseError) {
        console.error('解析评估结果失败:', parseError);
        throw new Error('无法解析评估结果');
      }
    } catch (error) {
      console.error('评估过程出错:', error);
      return this.generateFallbackEvaluation(resumeData, jobRequirement);
    }
  }
  
  /**
   * 构建评估提示
   */
  private buildEvaluationPrompt(
    resumeData: ResumeData,
    jobRequirement: JobRequirement,
    knowledgeContext: string,
    analysis: {
      allSkills: string[];
      requiredSkills: string[];
      preferredSkills: string[];
      experienceYears: number;
      experienceFields: string[];
    }
  ): string {
    // 整理简历数据
    const skills = resumeData.skills?.join(', ') || '无技能信息';
    
    // 整理工作经验
    let workExperience = '';
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      workExperience = resumeData.workExperience
        .map((exp: any) => {
          return `公司: ${exp.company || '未知'}, 职位: ${exp.position || '未知'}, ` + 
                `时间: ${exp.startDate || '?'} 至 ${exp.endDate || '现在'}, ` + 
                `技术: ${(exp.technologies || []).join(', ') || '未提及'}\n` + 
                `描述: ${exp.description || '无描述'}\n`;
        })
        .join('\n');
    } else {
      workExperience = '简历中未包含工作经验';
    }
    
    // 整理项目经验
    let projects = '';
    if (resumeData.projects && resumeData.projects.length > 0) {
      projects = resumeData.projects
        .map((proj: any) => {
          return `项目名称: ${proj.name || '未知项目'}, ` + 
                `角色: ${proj.role || '未知'}\n` + 
                `技术: ${(proj.technologies || []).join(', ') || '未提及'}\n` + 
                `描述: ${proj.description || '无描述'}\n`;
        })
        .join('\n');
    } else {
      projects = '简历中未包含项目经验';
    }
    
    // 整理教育背景
    let education = '';
    if (resumeData.education && resumeData.education.length > 0) {
      education = resumeData.education
        .map((edu: any) => {
          return `学校: ${edu.school || '未知'}, ` + 
                `学位: ${edu.degree || '未知'}, ` + 
                `专业: ${edu.major || '未知'}, ` +
                `时间: ${edu.startDate || '?'} 至 ${edu.endDate || '?'}`;
        })
        .join('\n');
    } else {
      education = '简历中未包含教育背景';
    }
    
    // 构建评估提示
    return `
请基于以下信息评估候选人简历与Web3职位的匹配度:

## 职位信息:
- 职位名称: ${jobRequirement.title || '未知职位'}
- 职位级别: ${jobRequirement.level || '未指定级别'}
- 必要技能: ${analysis.requiredSkills.join(', ') || '未指定必要技能'}
- 加分技能: ${analysis.preferredSkills.join(', ') || '未指定加分技能'}
- 经验要求: ${analysis.experienceYears}年以上 ${analysis.experienceFields.join(', ') || '相关领域'} 经验

## 候选人简历:
### 技能:
${skills}

### 工作经验:
${workExperience}

### 项目经验:
${projects}

### 教育背景:
${education}

## Web3知识与上下文:
${knowledgeContext}

## 技能匹配分析:
- 候选人技能: ${analysis.allSkills.join(', ')}
- 必要技能匹配: ${analysis.requiredSkills.filter(skill => 
    analysis.allSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  ).join(', ')}
- 加分技能匹配: ${analysis.preferredSkills.filter(skill => 
    analysis.allSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  ).join(', ')}

请根据上述信息进行全面评估，并以JSON格式返回以下内容:
{
  "skillMatches": [
    {
      "skill": "技能名称",
      "category": "技能类别(如blockchain, web3, defi等)",
      "relevance": 相关性评分(0-10),
      "level": "技能水平(beginner/intermediate/expert)",
      "description": "技能描述"
    }
  ],
  "missingSkills": ["职位要求但候选人缺乏的技能1", "技能2"...],
  "strengthAreas": ["候选人的优势领域1", "优势2"...],
  "improvementAreas": ["需要提升的领域1", "领域2"...],
  "careerSuggestions": ["职业发展建议1", "建议2"...],
  "learningResources": [
    {
      "skill": "技能名称",
      "resources": [
        {
          "title": "资源标题",
          "url": "资源链接",
          "type": "资源类型(文档/课程/教程)"
        }
      ]
    }
  ]
}

仅返回JSON内容，不需要任何其他说明或解释。
`;
  }
  
  /**
   * 获取技能相关上下文
   */
  private async getSkillsContext(skills: string[]): Promise<string> {
    let context = '以下是相关Web3技能的背景知识:\n\n';
    
    for (const skill of skills) {
      const skillInfo = this.knowledgeManager.getSkillKnowledge(skill);
      if (skillInfo) {
        context += `- ${skillInfo.name}: ${skillInfo.description}\n`;
        
        // 添加相关技能
        if (skillInfo.relatedSkills && skillInfo.relatedSkills.length > 0) {
          context += `  相关技能: ${skillInfo.relatedSkills.join(', ')}\n`;
        }
        
        context += '\n';
      }
    }
    
    // 补充从知识库中检索的信息
    const mainSkills = skills.slice(0, 5).join(' ');
    if (mainSkills) {
      try {
        const knowledgeResults = await this.knowledgeManager.getKnowledgeContext(mainSkills, 3);
        if (knowledgeResults) {
          context += '从知识库中检索到的相关信息:\n\n';
          context += knowledgeResults;
        }
      } catch (error) {
        console.error('获取知识上下文失败:', error);
      }
    }
    
    return context;
  }
  
  /**
   * 生成备用评估结果(当API调用失败时使用)
   */
  private generateFallbackEvaluation(
    resumeData: ResumeData,
    jobRequirement: JobRequirement
  ): EvaluationResult {
    const skills = resumeData.skills || [];
    const requiredSkills = jobRequirement.skills?.required || [];
    
    // 简单匹配技能
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    
    for (const skill of requiredSkills) {
      if (skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
    
    // 生成基础评估结果
    return {
      skillMatches: matchingSkills.map(skill => ({
        skill: { name: skill, description: '', category: 'blockchain', relatedTechnologies: [] },
        score: 0.8
      })),
      missingSkills,
      strengthAreas: ['技术能力', '区块链知识'],
      improvementAreas: ['需要补充缺失的必要技能'],
      careerSuggestions: ['建议继续Web3领域的发展'],
      learningResources: [
        {
          skill: 'Web3',
          resources: [
            {
              title: 'Web3开发文档',
              url: 'https://web3js.readthedocs.io/',
              type: '文档'
            }
          ]
        }
      ]
    };
  }
} 