import { SkillMatch } from '../types';
import { web3Skills } from './web3-skills-data';

/**
 * 从简历文本中提取Web3相关技能
 * @param text 简历原始文本或已提取的技能列表
 * @returns 匹配到的Web3技能及其相关度
 */
export function extractWeb3Skills(text: string | string[]): SkillMatch[] {
  const skills: SkillMatch[] = [];
  const skillsToProcess = Array.isArray(text) ? text : extractSkillsFromText(text);
  
  // 遍历技能数据库进行匹配
  for (const category in web3Skills) {
    const categorySkills = web3Skills[category as keyof typeof web3Skills];
    
    for (const skill of skillsToProcess) {
      const normalizedSkill = skill.toLowerCase().trim();
      
      // 检查完全匹配
      const exactMatch = categorySkills.find(s => 
        s.name.toLowerCase() === normalizedSkill ||
        s.aliases?.some(alias => alias.toLowerCase() === normalizedSkill)
      );
      
      if (exactMatch) {
        skills.push({
          skill: exactMatch.name,
          category: category as any,
          relevance: exactMatch.relevance || 5,
          level: inferSkillLevel(skill, text),
        });
        continue;
      }
      
      // 检查部分匹配
      for (const dbSkill of categorySkills) {
        if (
          normalizedSkill.includes(dbSkill.name.toLowerCase()) ||
          dbSkill.aliases?.some(alias => normalizedSkill.includes(alias.toLowerCase()))
        ) {
          skills.push({
            skill: dbSkill.name,
            category: category as any,
            relevance: Math.max(1, (dbSkill.relevance || 5) - 2), // 部分匹配降低相关度
            level: inferSkillLevel(skill, text),
          });
          break;
        }
      }
    }
  }
  
  // 去重并排序
  return deduplicateSkills(skills).sort((a, b) => b.relevance - a.relevance);
}

/**
 * 从文本中提取可能的技能
 */
function extractSkillsFromText(text: string): string[] {
  const skills: string[] = [];
  
  // 常见的技能列表标记
  const skillSectionMarkers = [
    '技能', '专业技能', '技术技能', '核心技能',
    'Skills', 'Technical Skills', 'Core Competencies'
  ];
  
  // 分割文本为行
  const lines = text.split('\n');
  let inSkillSection = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 检测是否进入或离开技能部分
    if (skillSectionMarkers.some(marker => 
        trimmedLine.toLowerCase().includes(marker.toLowerCase()) &&
        (trimmedLine.endsWith(':') || trimmedLine.endsWith('：') || trimmedLine.length < 20)
    )) {
      inSkillSection = true;
      continue;
    }
    
    // 如果空行或新的章节标题，可能已离开技能部分
    if (inSkillSection && (!trimmedLine || trimmedLine.endsWith(':') || trimmedLine.endsWith('：'))) {
      inSkillSection = false;
    }
    
    // 如果在技能部分，提取技能
    if (inSkillSection && trimmedLine) {
      // 处理不同的分隔方式
      if (trimmedLine.includes(',') || trimmedLine.includes('，')) {
        skills.push(...trimmedLine.split(/[,，]/).map(s => s.trim()).filter(s => s));
      } else if (trimmedLine.includes(';') || trimmedLine.includes('；')) {
        skills.push(...trimmedLine.split(/[;；]/).map(s => s.trim()).filter(s => s));
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        skills.push(trimmedLine.substring(1).trim());
      } else {
        skills.push(trimmedLine);
      }
    }
  }
  
  // 如果没有找到明确的技能部分，尝试直接从文本中提取已知的Web3技能
  if (skills.length === 0) {
    const allKnownSkills = Object.values(web3Skills).flat();
    
    for (const knownSkill of allKnownSkills) {
      if (text.toLowerCase().includes(knownSkill.name.toLowerCase())) {
        skills.push(knownSkill.name);
      }
      
      for (const alias of knownSkill.aliases || []) {
        if (text.toLowerCase().includes(alias.toLowerCase())) {
          skills.push(knownSkill.name);
          break;
        }
      }
    }
  }
  
  return [...new Set(skills)]; // 去重
}

/**
 * 去除重复的技能
 */
function deduplicateSkills(skills: SkillMatch[]): SkillMatch[] {
  const skillMap = new Map<string, SkillMatch>();
  
  for (const skill of skills) {
    const key = skill.skill.toLowerCase();
    
    if (!skillMap.has(key) || skillMap.get(key)!.relevance < skill.relevance) {
      skillMap.set(key, skill);
    }
  }
  
  return Array.from(skillMap.values());
}

/**
 * 从上下文尝试推断技能水平
 */
function inferSkillLevel(
  skill: string,
  context: string | string[]
): 'beginner' | 'intermediate' | 'expert' | undefined {
  const text = Array.isArray(context) ? context.join(' ') : context;
  const lowerText = text.toLowerCase();
  const lowerSkill = skill.toLowerCase();
  
  // 寻找专业水平指示词
  const expertIndicators = [
    '精通', '专家', '高级', '资深', '专精于', '深入理解',
    'expert', 'advanced', 'proficient', 'mastery', 'specialist'
  ];
  
  const intermediateIndicators = [
    '熟练', '良好', '中级', '有经验', '掌握',
    'intermediate', 'experienced', 'competent', 'skilled', 'familiar'
  ];
  
  const beginnerIndicators = [
    '基础', '入门', '了解', '初级', '初学',
    'beginner', 'basic', 'novice', 'limited', 'fundamental'
  ];
  
  // 尝试在技能附近找到水平指示词
  const skillContext = extractSkillContext(lowerText, lowerSkill, 100);
  
  if (expertIndicators.some(indicator => skillContext.includes(indicator))) {
    return 'expert';
  }
  
  if (intermediateIndicators.some(indicator => skillContext.includes(indicator))) {
    return 'intermediate';
  }
  
  if (beginnerIndicators.some(indicator => skillContext.includes(indicator))) {
    return 'beginner';
  }
  
  // 如果无法确定，返回undefined
  return undefined;
}

/**
 * 提取技能周围的上下文
 */
function extractSkillContext(text: string, skill: string, windowSize: number): string {
  const skillIndex = text.indexOf(skill);
  if (skillIndex === -1) return '';
  
  const start = Math.max(0, skillIndex - windowSize);
  const end = Math.min(text.length, skillIndex + skill.length + windowSize);
  
  return text.substring(start, end);
} 