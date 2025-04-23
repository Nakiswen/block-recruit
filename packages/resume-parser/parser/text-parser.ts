import { ResumeData } from '../types';

/**
 * 从纯文本解析简历信息
 * @param text 简历文本内容
 * @returns 解析结果
 */
export function parseTextResume(text: string): { data?: ResumeData; error?: string } {
  try {
    // 先创建一个空的简历数据结构
    const resumeData: ResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        links: [],
      },
      summary: '',
      skills: [],
      workExperience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: [],
      rawText: text,
    };

    // 分析文本以提取信息
    const lines = text.split('\n').map(line => line.trim());
    
    // 识别电子邮件
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    for (const line of lines) {
      const emailMatch = line.match(emailRegex);
      if (emailMatch) {
        resumeData.personalInfo.email = emailMatch[0];
        break;
      }
    }
    
    // 识别电话号码
    const phoneRegex = /\b(?:\+?86)?1[3-9]\d{9}\b|\b(?:\+?1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    for (const line of lines) {
      const phoneMatch = line.match(phoneRegex);
      if (phoneMatch) {
        resumeData.personalInfo.phone = phoneMatch[0];
        break;
      }
    }
    
    // 提取技能（识别常见的技能清单标记）
    const skillSectionIndices = findSectionIndices(lines, ['技能', '专业技能', '技术技能', 'Skills', 'Technical Skills']);
    if (skillSectionIndices.start !== -1 && skillSectionIndices.end !== -1) {
      const skillsSection = lines.slice(skillSectionIndices.start + 1, skillSectionIndices.end);
      resumeData.skills = extractSkills(skillsSection);
    }
    
    // 尝试识别工作经验部分
    const workSectionIndices = findSectionIndices(lines, ['工作经验', '工作经历', 'Experience', 'Work Experience']);
    if (workSectionIndices.start !== -1 && workSectionIndices.end !== -1) {
      const workSection = lines.slice(workSectionIndices.start + 1, workSectionIndices.end);
      resumeData.workExperience = extractWorkExperience(workSection);
    }
    
    // 尝试识别教育背景
    const eduSectionIndices = findSectionIndices(lines, ['教育背景', '教育经历', 'Education']);
    if (eduSectionIndices.start !== -1 && eduSectionIndices.end !== -1) {
      const eduSection = lines.slice(eduSectionIndices.start + 1, eduSectionIndices.end);
      resumeData.education = extractEducation(eduSection);
    }
    
    // 尝试提取个人信息（通常在文档顶部）
    if (lines.length > 0) {
      // 假设第一行可能是姓名
      resumeData.personalInfo.name = lines[0];
    }
    
    return { data: resumeData };
  } catch (error) {
    console.error('文本简历解析错误:', error);
    return { 
      error: '文本解析失败: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * 在文本中查找指定章节的起始和结束位置
 */
function findSectionIndices(lines: string[], possibleTitles: string[]): { start: number; end: number } {
  let start = -1;
  
  // 查找章节开始
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (possibleTitles.some(title => line.includes(title.toLowerCase()))) {
      start = i;
      break;
    }
  }
  
  if (start === -1) return { start: -1, end: -1 };
  
  // 查找章节结束（下一个章节开始）
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    // 如果遇到新的章节标题（通常是大写、冒号结尾或有明显格式）
    if (/^[A-Z\u4e00-\u9fa5]{2,}[：:]\s*$/.test(line) || 
        /^[A-Z\u4e00-\u9fa5]{2,}\s*$/.test(line)) {
      end = i;
      break;
    }
  }
  
  return { start, end };
}

/**
 * 从文本中提取技能列表
 */
function extractSkills(lines: string[]): string[] {
  const skills: string[] = [];
  
  for (const line of lines) {
    // 忽略空行
    if (!line.trim()) continue;
    
    // 如果是逗号分隔的列表
    if (line.includes(',') || line.includes('，')) {
      const parts = line.split(/[,，]/);
      for (const part of parts) {
        const skill = part.trim();
        if (skill) skills.push(skill);
      }
    } 
    // 如果是分号分隔的列表
    else if (line.includes(';') || line.includes('；')) {
      const parts = line.split(/[;；]/);
      for (const part of parts) {
        const skill = part.trim();
        if (skill) skills.push(skill);
      }
    }
    // 如果是项目符号列表
    else if (line.startsWith('•') || line.startsWith('-')) {
      const skill = line.substring(1).trim();
      if (skill) skills.push(skill);
    }
    // 否则整行作为一个技能
    else {
      skills.push(line.trim());
    }
  }
  
  return [...new Set(skills)]; // 去重
}

/**
 * 从文本中提取工作经验
 */
function extractWorkExperience(lines: string[]): ResumeData['workExperience'] {
  const experiences: ResumeData['workExperience'] = [];
  let currentExperience: ResumeData['workExperience'][0] | null = null;
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    // 检查是否是新的工作经验条目（通常包含公司名和日期）
    const companyDateMatch = line.match(/(.+?)\s+(\d{4}[\/.]\d{1,2})\s*[-–—至到to]\s*(\d{4}[\/.]\d{1,2}|\s*现在|\s*至今|\s*Present)/i);
    
    if (companyDateMatch) {
      // 保存上一个工作经验
      if (currentExperience) {
        experiences.push(currentExperience);
      }
      
      // 创建新的工作经验
      currentExperience = {
        company: companyDateMatch[1].trim(),
        position: '',
        startDate: companyDateMatch[2].trim(),
        endDate: companyDateMatch[3].trim(),
        description: '',
        highlights: [],
        technologies: [],
      };
    } 
    // 检查是否是职位信息
    else if (currentExperience && !currentExperience.position && 
             (line.includes('工程师') || line.includes('开发') || line.includes('程序员') || 
              line.includes('Engineer') || line.includes('Developer'))) {
      currentExperience.position = line.trim();
    }
    // 否则添加为工作描述或亮点
    else if (currentExperience) {
      if (line.startsWith('•') || line.startsWith('-')) {
        currentExperience.highlights.push(line.substring(1).trim());
      } else {
        if (currentExperience.description) {
          currentExperience.description += '\n' + line;
        } else {
          currentExperience.description = line;
        }
      }
      
      // 尝试从描述中提取使用的技术
      const techMatches = line.match(/使用([^。，；,.;]+)进行开发|技术栈[：:]\s*([^。，；,.;]+)|使用的技术[：:]\s*([^。，；,.;]+)|technologies?[：:]\s*([^。，；,.;]+)/i);
      if (techMatches) {
        const techs = (techMatches[1] || techMatches[2] || techMatches[3] || techMatches[4]).split(/[,，、/\\]/);
        currentExperience.technologies.push(...techs.map(t => t.trim()).filter(t => t));
      }
    }
  }
  
  // 添加最后一个工作经验
  if (currentExperience) {
    experiences.push(currentExperience);
  }
  
  return experiences;
}

/**
 * 从文本中提取教育背景
 */
function extractEducation(lines: string[]): ResumeData['education'] {
  const educations: ResumeData['education'] = [];
  let currentEducation: ResumeData['education'][0] | null = null;
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    // 检查是否是新的教育经历条目（通常包含学校名和日期）
    const schoolDateMatch = line.match(/(.+?)\s+(\d{4}[\/.]\d{1,2})\s*[-–—至到to]\s*(\d{4}[\/.]\d{1,2}|\s*现在|\s*至今|\s*Present)/i);
    
    if (schoolDateMatch) {
      // 保存上一个教育经历
      if (currentEducation) {
        educations.push(currentEducation);
      }
      
      // 创建新的教育经历
      currentEducation = {
        institution: schoolDateMatch[1].trim(),
        degree: '',
        field: '',
        startDate: schoolDateMatch[2].trim(),
        endDate: schoolDateMatch[3].trim(),
      };
    } 
    // 检查是否包含学位信息
    else if (currentEducation && 
             (line.includes('学士') || line.includes('硕士') || line.includes('博士') || 
              line.includes('专科') || line.includes('本科') ||
              line.includes('Bachelor') || line.includes('Master') || line.includes('PhD') || 
              line.includes('Degree'))) {
      
      // 尝试提取学位和专业
      const degreeMatch = line.match(/(学士|硕士|博士|专科|本科|Bachelor|Master|PhD)[学位]?\s*[,，]\s*(.+)/i);
      if (degreeMatch) {
        currentEducation.degree = degreeMatch[1].trim();
        currentEducation.field = degreeMatch[2].trim();
      } else {
        // 如果没有明确的格式，整行作为学位
        currentEducation.degree = line.trim();
      }
    }
    // 检查是否包含专业信息
    else if (currentEducation && !currentEducation.field &&
             (line.includes('专业') || line.includes('Major'))) {
      const majorMatch = line.match(/专业[：:]\s*(.+)/i) || line.match(/Major[：:]\s*(.+)/i);
      if (majorMatch) {
        currentEducation.field = majorMatch[1].trim();
      } else {
        currentEducation.field = line.trim();
      }
    }
  }
  
  // 添加最后一个教育经历
  if (currentEducation) {
    educations.push(currentEducation);
  }
  
  return educations;
} 