import { NextRequest, NextResponse } from 'next/server';
import { AgentWrapper } from 'resume-parser/ai-agent/agent-wrapper';
import { retrieveRelevantKnowledge } from 'resume-parser/ai-agent/web3-knowledge';
import { ResumeData } from 'resume-parser/types';

/**
 * 处理简历评估请求
 * 使用标准RAG流程: 
 * 1. 接收简历数据和职位要求
 * 2. 从简历中提取关键内容
 * 3. 从知识库中检索相关信息
 * 4. 结合简历、职位要求和检索知识进行评估
 * 5. 返回结构化评估结果
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const requestData = await request.json();
    const { resumeData, jobRequirements } = requestData;
    
    if (!resumeData) {
      return NextResponse.json(
        { error: '请提供简历数据' },
        { status: 400 }
      );
    }
    
    if (!jobRequirements) {
      return NextResponse.json(
        { error: '请提供职位要求' },
        { status: 400 }
      );
    }
    
    // 1. 使用RAG从知识库中检索相关信息
    const ragContext = await retrieveRelevantKnowledge(resumeData);
    
    // 2. 构建评估提示
    const evaluationPrompt = buildEvaluationPrompt(resumeData, jobRequirements);
    
    // 3. 创建Agent实例
    const agent = new AgentWrapper();
    
    // 4. 使用RAG增强的Agent进行评估
    const evaluationResult = await agent.processWithRAG(evaluationPrompt, ragContext);
    
    // 5. 解析评估结果
    let parsedResult;
    try {
      // 处理可能包含Markdown代码块的响应
      let jsonContent = evaluationResult;
      
      // 移除Markdown的```json和```标记
      const codeBlockMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1];
      }
      
      // 修复常见JSON格式问题
      jsonContent = jsonContent
        .replace(/,\s*}(?!\s*[,\]}])/g, '}') // 修复对象末尾多余的逗号
        .replace(/,\s*](?!\s*[,\]}])/g, ']') // 修复数组末尾多余的逗号
        .replace(/'/g, '"')  // 将单引号替换为双引号
        .replace(/([{[,])\s*([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":') // 为没有引号的键名添加引号
        .trim();
      
      try {
        parsedResult = JSON.parse(jsonContent);
      } catch (jsonError) {
        // 如果解析失败，尝试更灵活的解析
        console.warn('标准JSON解析失败，尝试提取JSON对象:', jsonError);
        
        // 查找可能的JSON对象 (使用正则表达式寻找{...}结构)
        const jsonObjectMatch = jsonContent.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          try {
            parsedResult = JSON.parse(jsonObjectMatch[0]);
          } catch (objectError) {
            console.error('提取JSON对象失败:', objectError);
            throw new Error('无法解析评估结果中的JSON对象');
          }
        } else {
          throw new Error('评估结果中没有找到有效的JSON对象');
        }
      }
    } catch (error) {
      console.error('解析评估结果失败:', error, '\n原始响应:', evaluationResult);
      
      // 构造一个基本的评估结果
      parsedResult = {
        overallScore: 5,
        skillsScore: 5,
        experienceScore: 5,
        educationScore: 5,
        projectsScore: 5,
        matchingSkills: [],
        relevantExperience: [],
        strengths: ["无法自动识别优势"],
        weaknesses: ["无法自动识别不足"],
        recommendations: ["请手动评估简历"],
        summary: "评估结果解析失败，请重新尝试或手动评估",
        rawResponse: evaluationResult.substring(0, 500) + (evaluationResult.length > 500 ? '...' : '')
      };
    }
    
    // 确保结果包含所有必要字段
    const defaultResult = {
      overallScore: 5,
      skillsScore: 5,
      experienceScore: 5,
      educationScore: 5,
      projectsScore: 5,
      matchingSkills: [],
      relevantExperience: [],
      strengths: [],
      weaknesses: [],
      recommendations: []
    };
    
    // 合并默认值和解析结果
    const finalResult = {...defaultResult, ...parsedResult};
    
    // 返回评估结果
    return NextResponse.json({ 
      evaluation: finalResult,
      success: true
    });
    
  } catch (error) {
    console.error('简历评估错误:', error);
    return NextResponse.json(
      { error: `评估失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

/**
 * 构建评估提示
 */
function buildEvaluationPrompt(resumeData: ResumeData, jobRequirements: any): string {
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
  
  // 整理职位要求
  const jobTitle = jobRequirements.title || '未知职位';
  const requiredSkills = jobRequirements.skills?.required?.join(', ') || '未指定必备技能';
  const preferredSkills = jobRequirements.skills?.preferred?.join(', ') || '未指定加分技能';
  const skillsRequirement = `必备: ${requiredSkills}, 加分: ${preferredSkills}`;
  const jobDescription = jobRequirements.description || '未提供职位描述';
  const experience = `最低经验年限: ${jobRequirements.experience?.minYears || '未指定'}, 相关领域: ${jobRequirements.experience?.requiredFields?.join(', ') || '未指定相关领域'}`;
  
  // 构建评估提示
  return `
请评估以下候选人简历与职位要求的匹配度，特别是在Web3和区块链技能方面:

## 职位信息:
- 职位名称: ${jobTitle}
- 所需技能: ${skillsRequirement}
- 经验要求: ${experience}
- 职位描述: ${jobDescription}

## 候选人简历:
### 技能:
${skills}

### 工作经验:
${workExperience}

### 项目经验:
${projects}

### 教育背景:
${education}

请进行全面评估，并以JSON格式返回以下内容:
{
  "overallScore": 评分(0-10),
  "skillsScore": 技能匹配评分(0-10),
  "experienceScore": 经验匹配评分(0-10),
  "educationScore": 教育背景评分(0-10),
  "projectsScore": 经验匹配评分(0-10),
  "matchingSkills": [
    { 
      "skill": "技能名称", 
      "relevance": 相关性评分(0-10), 
      "category": "技能类别(如Web3, 编程, 区块链等)",
      "level": "掌握程度(初级/中级/高级)"
    }
  ],
  "relevantExperience": [
    {
      "company": "公司名称",
      "position": "职位名称",
      "relevance": 相关性评分(0-10),
      "duration": 工作时长(月),
      "web3Related": 是否Web3相关(true/false)
    }
  ],
  "missingSkills": ["职位要求但简历未包含的技能1", ...],
  "strengths": ["优势1", "优势2", ...],
  "weaknesses": ["不足1", "不足2", ...],
  "recommendations": ["建议1", "建议2", ...]
}

重要提示:
1. 直接返回JSON对象，不要使用Markdown代码块包装(不要使用\`\`\`json格式)
2. 确保输出的JSON格式有效且严格遵循上述结构
3. 所有评分字段使用数字(0-10)，不要使用字符串
4. 确保所有数组至少包含一个元素
5. 不要在JSON中添加注释
`;
} 