/**
 * 评分工具函数
 * 用于计算简历和岗位之间的业务规则评分
 */

/**
 * 计算业务规则评分
 * @param resumeMetadata 简历元数据
 * @param jobMetadata 岗位元数据
 * @returns 业务规则评分(0-1之间)
 */
export async function calculateBusinessScore(
  resumeMetadata: any,
  jobMetadata: any
): Promise<number> {
  // 技能匹配评分 (权重25%)
  const skillScore = calculateSkillScore(
    resumeMetadata.skills || [],
    jobMetadata.required_skills || [],
    jobMetadata.preferred_skills || []
  );

  // 经验匹配评分 (权重15%)
  const experienceScore = calculateExperienceScore(
    resumeMetadata.experience_years,
    jobMetadata.experience_years,
    resumeMetadata.industry_experience || [],
    jobMetadata.industry || []
  );

  // 学历匹配评分 (权重10%)
  const educationScore = calculateEducationScore(
    resumeMetadata.education_level,
    jobMetadata.education_level
  );

  // 计算加权总分
  return 0.5 * skillScore + 0.3 * experienceScore + 0.2 * educationScore;
}

/**
 * 计算技能匹配评分
 * @param candidateSkills 候选人技能列表
 * @param requiredSkills 岗位必要技能
 * @param preferredSkills 岗位加分技能
 * @returns 技能匹配评分(0-1之间)
 */
function calculateSkillScore(
  candidateSkills: string[],
  requiredSkills: string[],
  preferredSkills: string[]
): number {
  if (!requiredSkills.length) return 1; // 如果没有必要技能，默认满分

  // 将所有技能转为小写以忽略大小写差异
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase());
  const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase());
  const normalizedPreferredSkills = preferredSkills.map(s => s.toLowerCase());

  // 计算必要技能匹配率 (权重80%)
  const matchedRequiredCount = normalizedRequiredSkills.filter(skill => 
    normalizedCandidateSkills.includes(skill)
  ).length;
  
  const requiredSkillScore = requiredSkills.length > 0 
    ? matchedRequiredCount / requiredSkills.length 
    : 1;

  // 计算加分技能匹配率 (权重20%)
  const matchedPreferredCount = normalizedPreferredSkills.filter(skill => 
    normalizedCandidateSkills.includes(skill)
  ).length;
  
  const preferredSkillScore = preferredSkills.length > 0 
    ? matchedPreferredCount / preferredSkills.length 
    : 0;

  // 技能总得分
  return 0.8 * requiredSkillScore + 0.2 * preferredSkillScore;
}

/**
 * 计算经验匹配评分
 * @param candidateYears 候选人工作年限
 * @param requiredYears 岗位要求年限
 * @param candidateIndustries 候选人行业经验
 * @param jobIndustries 岗位所属行业
 * @returns 经验匹配评分(0-1之间)
 */
function calculateExperienceScore(
  candidateYears: number,
  requiredYears: number,
  candidateIndustries: string[],
  jobIndustries: string[]
): number {
  // 工作年限评分 (权重70%)
  let yearsScore = 0;
  if (!requiredYears) {
    yearsScore = 1; // 如果没有年限要求，默认满分
  } else if (candidateYears >= requiredYears) {
    yearsScore = 1; // 达到或超过要求年限，满分
  } else if (candidateYears >= requiredYears * 0.7) {
    // 达到要求的70%以上，按比例得分
    yearsScore = candidateYears / requiredYears;
  } else {
    // 不到要求的70%，低分
    yearsScore = 0.5 * (candidateYears / requiredYears);
  }

  // 行业经验评分 (权重30%)
  let industryScore = 0;
  if (!jobIndustries.length) {
    industryScore = 1; // 如果没有行业要求，默认满分
  } else {
    const normalizedCandidateIndustries = candidateIndustries.map(i => i.toLowerCase());
    const normalizedJobIndustries = jobIndustries.map(i => i.toLowerCase());
    
    // 计算行业匹配数
    const matchedIndustryCount = normalizedJobIndustries.filter(industry => 
      normalizedCandidateIndustries.includes(industry)
    ).length;
    
    industryScore = jobIndustries.length > 0 
      ? matchedIndustryCount / jobIndustries.length 
      : 1;
  }

  // 综合经验得分
  return 0.7 * yearsScore + 0.3 * industryScore;
}

/**
 * 计算学历匹配评分
 * @param candidateEducation 候选人学历
 * @param requiredEducation 岗位要求学历
 * @returns 学历匹配评分(0-1之间)
 */
function calculateEducationScore(
  candidateEducation: string,
  requiredEducation: string
): number {
  if (!requiredEducation) return 1; // 如果没有学历要求，默认满分
  
  // 学历等级映射表（从低到高）
  const educationLevels: Record<string, number> = {
    '高中': 1,
    '大专': 2,
    '本科': 3,
    '硕士': 4,
    '博士': 5
  };

  // 获取学历等级
  const candidateLevel = educationLevels[candidateEducation] || 0;
  const requiredLevel = educationLevels[requiredEducation] || 0;

  // 如果没有找到对应的学历等级，返回0.5分
  if (candidateLevel === 0 || requiredLevel === 0) return 0.5;

  // 计算学历匹配得分
  if (candidateLevel >= requiredLevel) {
    return 1; // 达到或超过要求学历，满分
  } else {
    // 未达到要求，按差距计算得分
    const gap = requiredLevel - candidateLevel;
    return Math.max(0, 1 - 0.3 * gap); // 每低一级扣30%
  }
} 