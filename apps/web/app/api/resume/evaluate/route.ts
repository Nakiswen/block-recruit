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
      parsedResult = JSON.parse(evaluationResult);
    } catch (error) {
      console.error('解析评估结果失败:', error);
      parsedResult = { 
        rawResult: evaluationResult, 
        error: '评估结果格式解析失败'
      };
    }
    
    // 返回评估结果
    return NextResponse.json({ 
      evaluation: parsedResult,
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
  const requiredSkills = jobRequirements.skills?.join(', ') || '未指定技能要求';
  const jobDescription = jobRequirements.description || '未提供职位描述';
  const experience = jobRequirements.experience || '未指定经验要求';
  
  // 构建评估提示
  return `
请评估以下候选人简历与职位要求的匹配度，特别是在Web3和区块链技能方面:

## 职位信息:
- 职位名称: ${jobTitle}
- 所需技能: ${requiredSkills}
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
  "matchingSkills": [
    { 
      "skill": "技能名称", 
      "relevance": 相关性评分(0-10), 
      "category": "技能类别(如Web3, 编程, 区块链等)",
      "level": "掌握程度(初级/中级/高级)"
    }
  ],
  "missingSkills": ["职位要求但简历未包含的技能1", ...],
  "strengths": ["优势1", "优势2", ...],
  "weaknesses": ["不足1", "不足2", ...],
  "summary": "整体评估总结"
}
`;
} 