import { ragService } from '../rag/ragService';
import { calculateBusinessScore } from '../utils/scoringUtils';

/**
 * 岗位简历智能匹配服务
 * 负责处理岗位与简历之间的匹配逻辑
 */
export const matchingService = {
  /**
   * 为简历匹配合适的岗位
   * @param resumeId 简历ID
   * @param filters 匹配过滤条件
   * @returns 匹配结果，包含匹配度和匹配原因
   */
  async matchJobsForResume(resumeId: string, filters: {
    minMatchScore?: number,
    location?: string,
    industry?: string,
    educationLevel?: string,
    experienceYears?: number,
  } = {}) {
    const minMatchScore = filters.minMatchScore || 0.6; // 默认匹配度阈值为60%
    
    try {
      // 1. 获取简历向量和元数据
      const resumeVector = await ragService.getResumeVector(resumeId);
      if (!resumeVector) {
        throw new Error('简历向量不存在，请先处理简历');
      }

      // 2. 使用元数据预过滤
      const metadataFilters = {
        ...(filters.location ? { location: filters.location } : {}),
        ...(filters.industry ? { industry: filters.industry } : {}),
      };

      // 3. 获取向量匹配的岗位列表
      const similarJobs = await ragService.findSimilarJobs(resumeVector.vector, {
        filters: metadataFilters,
        minScore: 0.3, // 向量匹配度阈值较低，后续会结合业务规则重新排序
        topK: 50 // 最多获取50个候选岗位
      });

      // 4. 结合业务规则进行评分
      const matchResults = [];
      for (const match of similarJobs.matches) {
        // 计算向量匹配度得分 (0.5权重)
        const vectorScore = match.score;
        
        // 计算业务规则匹配度 (0.5权重)
        const businessScore = await calculateBusinessScore(
          resumeVector.metadata,
          match.metadata
        );

        // 综合得分
        const totalScore = 0.5 * vectorScore + 0.5 * businessScore;
        
        // 如果综合得分超过阈值，添加到结果中
        if (totalScore >= minMatchScore) {
          matchResults.push({
            jobId: match.id,
            score: totalScore,
            vectorScore,
            businessScore,
            matchReasons: this.generateMatchReasons(resumeVector.metadata, match.metadata),
            jobInfo: {
              title: match.metadata.title,
              company: match.metadata.company,
              location: match.metadata.location,
              salaryRange: match.metadata.salary_range,
              requiredSkills: match.metadata.required_skills,
              experienceYears: match.metadata.experience_years,
              educationLevel: match.metadata.education_level
            }
          });
        }
      }

      // 5. 按总得分排序
      matchResults.sort((a, b) => b.score - a.score);

      return {
        resumeId,
        totalMatches: matchResults.length,
        matches: matchResults,
        searchTimeMs: similarJobs.searchTimeMs,
      };
    } catch (error) {
      console.error('简历匹配岗位失败:', error);
      throw error;
    }
  },

  /**
   * 为岗位匹配合适的简历
   * @param jobId 岗位ID
   * @param filters 匹配过滤条件
   * @returns 匹配结果，包含匹配度和匹配原因
   */
  async matchResumesForJob(jobId: string, filters: {
    minMatchScore?: number,
    location?: string,
    educationLevel?: string,
    experienceYears?: number,
    skills?: string[],
  } = {}) {
    const minMatchScore = filters.minMatchScore || 0.6; // 默认匹配度阈值为60%
    
    try {
      // 1. 获取岗位向量和元数据
      const jobVector = await ragService.getJobVector(jobId);
      if (!jobVector) {
        throw new Error('岗位向量不存在，请先处理岗位');
      }

      // 2. 使用元数据预过滤
      const metadataFilters = {
        ...(filters.location ? { location: filters.location } : {}),
        ...(filters.experienceYears ? { experience_years: { $gte: filters.experienceYears } } : {}),
        ...(filters.educationLevel ? { education_level: filters.educationLevel } : {})
      };

      // 3. 获取向量匹配的简历列表
      const similarResumes = await ragService.findSimilarResumes(jobVector.vector, {
        filters: metadataFilters,
        minScore: 0.3, // 向量匹配度阈值较低，后续会结合业务规则重新排序
        topK: 50 // 最多获取50个候选简历
      });

      // 4. 结合业务规则进行评分
      const matchResults = [];
      for (const match of similarResumes.matches) {
        // 计算向量匹配度得分 (0.5权重)
        const vectorScore = match.score;
        
        // 计算业务规则匹配度 (0.5权重)
        const businessScore = await calculateBusinessScore(
          match.metadata,
          jobVector.metadata
        );

        // 综合得分
        const totalScore = 0.5 * vectorScore + 0.5 * businessScore;
        
        // 如果综合得分超过阈值，添加到结果中
        if (totalScore >= minMatchScore) {
          matchResults.push({
            resumeId: match.id,
            score: totalScore,
            vectorScore,
            businessScore,
            matchReasons: this.generateMatchReasons(match.metadata, jobVector.metadata),
            resumeInfo: {
              owner: match.metadata.owner,
              skills: match.metadata.skills,
              experienceYears: match.metadata.experience_years,
              educationLevel: match.metadata.education_level,
              industryExperience: match.metadata.industry_experience,
              location: match.metadata.location
            }
          });
        }
      }

      // 5. 按总得分排序
      matchResults.sort((a, b) => b.score - a.score);

      return {
        jobId,
        totalMatches: matchResults.length,
        matches: matchResults,
        searchTimeMs: similarResumes.searchTimeMs
      };
    } catch (error) {
      console.error('岗位匹配简历失败:', error);
      throw error;
    }
  },

  /**
   * 生成匹配原因描述
   * @param candidateMetadata 候选元数据（简历或岗位）
   * @param targetMetadata 目标元数据（岗位或简历）
   * @returns 匹配原因列表
   */
  generateMatchReasons(candidateMetadata: any, targetMetadata: any): string[] {
    const reasons: string[] = [];

    // 技能匹配
    if (candidateMetadata.skills && targetMetadata.required_skills) {
      const matchedSkills = candidateMetadata.skills.filter((skill: string) => 
        targetMetadata.required_skills.includes(skill)
      );
      if (matchedSkills.length > 0) {
        reasons.push(`技能匹配: 具备${matchedSkills.length}项所需技能（${matchedSkills.join(', ')}）`);
      }
    }

    // 经验匹配
    if (candidateMetadata.experience_years !== undefined && 
        targetMetadata.experience_years !== undefined) {
      if (candidateMetadata.experience_years >= targetMetadata.experience_years) {
        reasons.push(`经验匹配: 具备${candidateMetadata.experience_years}年经验，符合岗位${targetMetadata.experience_years}年要求`);
      }
    }

    // 行业经验匹配
    if (candidateMetadata.industry_experience && targetMetadata.industry) {
      const matchingIndustry = candidateMetadata.industry_experience.find((industry: string) => 
        industry === targetMetadata.industry
      );
      if (matchingIndustry) {
        reasons.push(`行业匹配: 具备${matchingIndustry}行业经验`);
      }
    }

    // 地点匹配
    if (candidateMetadata.location && targetMetadata.location &&
        candidateMetadata.location === targetMetadata.location) {
      reasons.push(`地点匹配: 地点相符（${candidateMetadata.location}）`);
    }

    // 教育背景
    if (candidateMetadata.education_level && targetMetadata.education_level) {
      const educationLevels = ['高中', '大专', '本科', '硕士', '博士'];
      const candidateLevel = educationLevels.indexOf(candidateMetadata.education_level);
      const targetLevel = educationLevels.indexOf(targetMetadata.education_level);
      if (candidateLevel >= targetLevel && targetLevel >= 0 && candidateLevel >= 0) {
        reasons.push(`教育匹配: 教育水平(${candidateMetadata.education_level})符合要求(${targetMetadata.education_level})`);
      }
    }

    return reasons;
  }
}; 