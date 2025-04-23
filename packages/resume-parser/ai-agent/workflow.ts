import { ResumeData } from '../types';

// Agent接口定义
export interface Agent {
  generateText(prompt: string): Promise<string>;
}

// 工作流输入接口
export interface WorkflowInput {
  fileContent: string;
  fileName: string;
  fileType: string;
}

// 工作流结果接口
export interface WorkflowResult {
  personal: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    links: string[];
  };
  skills: string[];
  workExperience: Array<{
    company: string | null;
    position: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
    technologies: string[];
  }>;
  education: Array<{
    school: string | null;
    degree: string | null;
    major: string | null;
    startDate: string | null;
    endDate: string | null;
    description?: string | null;
  }>;
  projects: Array<{
    name: string | null;
    description: string | null;
    technologies: string[];
    role: string | null;
    url?: string | null;
  }>;
}

/**
 * 使用AI代理解析简历
 * @param agent - AI代理实例
 * @param input - 工作流输入
 * @returns 解析后的简历数据
 */
export async function runWorkflow(
  agent: Agent,
  input: WorkflowInput
): Promise<ResumeData> {
  const { fileContent, fileName, fileType } = input;
  const results: Partial<WorkflowResult> = {};
  
  // 步骤1: 提取基本简历文本
  const stepOnePrompt = `
  我需要您分析以下简历内容，并理解其结构。这是一份${fileType.toUpperCase()}格式的简历文件，
  文件名为"${fileName}"。请通读全文，识别简历的结构，包括个人信息、工作经验、教育背景、技能等部分。
  特别注意识别Web3和区块链相关的内容，例如区块链项目经验、加密货币知识、智能合约开发等。
  
  以下是简历的完整内容:
  ${fileContent}
  
  请分析上述内容，确保你理解了简历的整体结构和内容。
  `;
  
  await agent.generateText(stepOnePrompt);
  
  // 步骤2: 提取个人信息
  const personalInfoPrompt = `
  请从简历中提取人员的个人信息，包括:
  - 姓名
  - 电子邮件
  - 电话号码
  - 所在地址/城市
  - 个人网站/链接 (GitHub, LinkedIn等)
  
  请以JSON格式返回结果:
  
  {
    "name": "姓名",
    "email": "电子邮件",
    "phone": "电话号码",
    "location": "地址/城市",
    "links": ["链接1", "链接2"]
  }
  
  如果某项信息不存在，请使用null值。确保结果是有效的JSON格式。
  `;
  
  try {
    const personalInfoResponse = await agent.generateText(personalInfoPrompt);
    const personalInfo = extractJsonFromResponse(personalInfoResponse);
    
    if (personalInfo) {
      results.personal = {
        name: personalInfo.name || extractName(fileContent) || null,
        email: personalInfo.email || extractEmail(fileContent) || null,
        phone: personalInfo.phone || extractPhone(fileContent) || null,
        location: personalInfo.location || null,
        links: personalInfo.links || []
      };
    } else {
      // 如果JSON解析失败，尝试直接从文本中提取
      results.personal = {
        name: extractName(fileContent) || null,
        email: extractEmail(fileContent) || null,
        phone: extractPhone(fileContent) || null,
        location: null,
        links: []
      };
    }
  } catch (error) {
    console.error('提取个人信息时出错:', error);
    results.personal = {
      name: extractName(fileContent) || null,
      email: extractEmail(fileContent) || null,
      phone: extractPhone(fileContent) || null,
      location: null,
      links: []
    };
  }
  
  // 步骤3: 提取工作经验
  const workExperiencePrompt = `
  请从简历中提取所有工作经验，包括:
  - 公司名称
  - 职位名称
  - 开始和结束日期
  - 工作描述
  - 使用的技术栈
  
  特别关注与Web3、区块链、加密货币相关的经验。
  
  请以JSON格式返回结果，包含所有工作经验的数组:
  
  {
    "experiences": [
      {
        "company": "公司名称",
        "position": "职位名称",
        "startDate": "开始日期",
        "endDate": "结束日期或'至今'",
        "description": "工作描述",
        "technologies": ["技术1", "技术2"]
      },
      ...
    ]
  }
  
  确保结果是有效的JSON格式。如果无法确定某个字段的值，使用null。
  `;
  
  try {
    const workResponse = await agent.generateText(workExperiencePrompt);
    const workExperience = extractJsonFromResponse(workResponse);
    
    if (workExperience && Array.isArray(workExperience.experiences)) {
      results.workExperience = workExperience.experiences.map((exp: any) => ({
        company: exp.company || null,
        position: exp.position || null,
        startDate: exp.startDate || null,
        endDate: exp.endDate || null,
        description: exp.description || null,
        technologies: exp.technologies || []
      }));
    } else {
      results.workExperience = [];
    }
  } catch (error) {
    console.error('提取工作经验时出错:', error);
    results.workExperience = [];
  }
  
  // 步骤4: 提取教育背景
  const educationPrompt = `
  请从简历中提取所有教育经历，包括:
  - 学校/大学名称
  - 学位
  - 专业/学科
  - 开始和结束日期
  
  请以JSON格式返回结果:
  
  {
    "education": [
      {
        "school": "学校名称",
        "degree": "学位",
        "major": "专业",
        "startDate": "开始日期",
        "endDate": "结束日期或'至今'"
      },
      ...
    ]
  }
  
  确保结果是有效的JSON格式。如果无法确定某个字段的值，使用null。
  `;
  
  try {
    const educationResponse = await agent.generateText(educationPrompt);
    const educationInfo = extractJsonFromResponse(educationResponse);
    
    if (educationInfo && Array.isArray(educationInfo.education)) {
      results.education = educationInfo.education.map((edu: any) => ({
        school: edu.school || null,
        degree: edu.degree || null,
        major: edu.major || null,
        startDate: edu.startDate || null,
        endDate: edu.endDate || null,
        description: edu.description || null
      }));
    } else {
      results.education = [];
    }
  } catch (error) {
    console.error('提取教育背景时出错:', error);
    results.education = [];
  }
  
  // 步骤5: 提取并匹配技能
  const skillsPrompt = `
  请从简历中提取所有技能，特别是与Web3和区块链相关的技能，例如:
  - 区块链平台: Ethereum, Bitcoin, Polkadot, Solana等
  - 智能合约开发: Solidity, Vyper, Rust等
  - Web3库和框架: web3.js, ethers.js, Hardhat, Truffle等
  - DeFi协议和工具
  - NFT开发经验
  - DAO治理
  - 通用编程语言和框架
  
  请以JSON格式返回结果:
  
  {
    "skills": [
      "技能1",
      "技能2",
      ...
    ]
  }
  
  确保结果是有效的JSON格式。
  `;
  
  try {
    const skillsResponse = await agent.generateText(skillsPrompt);
    const skillsInfo = extractJsonFromResponse(skillsResponse);
    
    if (skillsInfo && Array.isArray(skillsInfo.skills)) {
      results.skills = skillsInfo.skills;
    } else {
      results.skills = [];
    }
  } catch (error) {
    console.error('提取技能时出错:', error);
    results.skills = [];
  }
  
  // 步骤6: 提取项目经验
  const projectsPrompt = `
  请从简历中提取所有项目经验，特别关注Web3和区块链相关项目，包括:
  - 项目名称
  - 项目描述
  - 使用的技术
  - 贡献/角色
  
  请以JSON格式返回结果:
  
  {
    "projects": [
      {
        "name": "项目名称",
        "description": "项目描述",
        "technologies": ["技术1", "技术2"],
        "role": "贡献/角色"
      },
      ...
    ]
  }
  
  确保结果是有效的JSON格式。如果无法确定某个字段的值，使用null。
  `;
  
  try {
    const projectsResponse = await agent.generateText(projectsPrompt);
    const projectsInfo = extractJsonFromResponse(projectsResponse);
    
    if (projectsInfo && Array.isArray(projectsInfo.projects)) {
      results.projects = projectsInfo.projects.map((proj: any) => ({
        name: proj.name || null,
        description: proj.description || null,
        technologies: proj.technologies || [],
        role: proj.role || null,
        url: proj.url || null
      }));
    } else {
      results.projects = [];
    }
  } catch (error) {
    console.error('提取项目经验时出错:', error);
    results.projects = [];
  }
  
  // 步骤7: 组装最终结果
  return {
    personalInfo: {
      name: (results.personal && results.personal.name) || "",
      email: (results.personal && results.personal.email) || "",
      phone: (results.personal && results.personal.phone) || "",
      location: (results.personal && results.personal.location) || "",
      links: (results.personal && results.personal.links) 
        ? results.personal.links.map(link => ({
            label: "Link",
            url: link
          }))
        : []
    },
    summary: "",
    skills: results.skills || [],
    workExperience: (results.workExperience && results.workExperience.length > 0)
      ? results.workExperience.map(exp => ({
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || "",
          highlights: [],
          technologies: exp.technologies || []
        }))
      : [],
    education: results.education ? results.education.map(edu => ({
      institution: edu.school || "",
      degree: edu.degree || "",
      field: edu.major || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: edu.description || ""
    })) : [],
    projects: results.projects ? results.projects.map(proj => ({
      name: proj.name || "",
      description: proj.description || "",
      technologies: proj.technologies || [],
      role: proj.role || "",
      url: proj.url || ""
    })) : [],
    certifications: [],
    languages: [],
    rawText: fileContent
  };
}

/**
 * 从响应中提取JSON
 * @param response - AI响应文本
 * @returns 解析后的JSON对象或null
 */
function extractJsonFromResponse(response: string): any {
  try {
    // 尝试在响应中找到JSON对象
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('解析JSON响应失败:', error);
    return null;
  }
}

/**
 * 从文本中提取姓名
 * @param text - 文本内容
 * @returns 提取的姓名或null
 */
function extractName(text: string): string | null {
  // 简单的姓名提取逻辑，实际应用中需要更复杂的算法
  const nameRegex = /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m;
  const match = text.match(nameRegex);
  return match ? match[0] : null;
}

/**
 * 从文本中提取电子邮件
 * @param text - 文本内容
 * @returns 提取的电子邮件或null
 */
function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
}

/**
 * 从文本中提取电话号码
 * @param text - 文本内容
 * @returns 提取的电话号码或null
 */
function extractPhone(text: string): string | null {
  const phoneRegex = /(?:\+\d{1,3}[-\.\s]?)?\(?\d{3}\)?[-\.\s]?\d{3}[-\.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : null;
} 