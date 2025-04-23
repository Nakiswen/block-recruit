import { ResumeData } from '../../resume-parser/types';

/**
 * Web3技能信息接口
 */
export interface Web3Skill {
  /** 技能名称 */
  name: string;
  /** 技能描述 */
  description: string;
  /** 技能分类 */
  category: string;
  /** 相关技术 */
  relatedTechnologies: string[];
  /** 技能嵌入向量 */
  embedding?: number[];
}

/**
 * Web3知识库接口
 */
export interface Web3KnowledgeBase {
  /** 知识库ID */
  id?: string;
  /** 知识库中的技能列表 */
  skills: Web3Skill[];
  /** 知识库名称 */
  name: string;
  /** 知识库版本 */
  version: string;
  /** 最后更新日期 */
  lastUpdated: string;
  /** 创建时间 */
  createdAt?: Date;
  /** 更新时间 */
  updatedAt?: Date;
  /** 描述 */
  description?: string;
  /** 学习资源 */
  resources?: Array<{
    title: string;
    description: string;
    url?: string;
    type?: string;
  }>;
}

/**
 * 技能匹配结果接口
 */
export interface SkillMatch {
  /** 匹配的技能 */
  skill: Web3Skill;
  /** 相似度分数 */
  score: number;
}

/**
 * 知识查询结果接口
 */
export interface KnowledgeQueryResult {
  /** 匹配的技能 */
  skill: Web3Skill;
  /** 相似度分数 */
  score: number;
  /** 其他相关信息 */
  context?: string;
}

export interface SkillInfo {
  name: string;
  category: 'blockchain' | 'web3' | 'defi' | 'nft' | 'dao' | 'programming' | 'other';
  description: string;
  level?: 'beginner' | 'intermediate' | 'expert';
  relatedSkills?: string[];
}

export interface EmbeddingResult {
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export interface QueryResult {
  text: string;
  similarity: number;
  metadata?: Record<string, any>;
}

export interface ResumeSkillMatch {
  skill: string;
  category: 'blockchain' | 'web3' | 'defi' | 'nft' | 'dao' | 'programming' | 'other';
  relevance: number; // 0-10
  level?: 'beginner' | 'intermediate' | 'expert';
  description?: string;
  matchedContexts?: string[];
}

export interface Web3ResumeEvaluation {
  overallScore: number; // 0-10
  skillMatches: ResumeSkillMatch[];
  missingSkills: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  careerSuggestions: string[];
  learningResources: Array<{
    skill: string;
    resources: Array<{
      title: string;
      url: string;
      type: 'course' | 'documentation' | 'tutorial' | 'book' | 'other';
    }>;
  }>;
}

/**
 * 学习资源
 */
export interface LearningResource {
  skill: string;
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

/**
 * 职位要求
 */
export interface JobRequirement {
  title?: string;
  level?: string;
  skills?: {
    required?: string[];
    preferred?: string[];
  };
  experience?: {
    minYears?: number;
    requiredFields?: string[];
  };
}

/**
 * 评估结果
 */
export interface EvaluationResult {
  skillMatches: SkillMatch[];
  missingSkills: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  careerSuggestions: string[];
  learningResources: LearningResource[];
} 