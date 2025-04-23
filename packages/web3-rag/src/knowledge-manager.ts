import { EmbeddingResult, QueryResult, SkillInfo, Web3KnowledgeBase, Web3Skill, KnowledgeQueryResult } from './types';
import { embedTextSafe } from './api';
import { categorizeWeb3Skill, chunkText, generateId } from './utils';

// 缓存向量嵌入，减少重复计算
const embeddingCache: Map<string, number[]> = new Map();

// 模拟内部存储
const KNOWLEDGE_BASES: Map<string, Web3KnowledgeBase> = new Map();
const EMBEDDINGS: Map<string, EmbeddingResult[]> = new Map();
const WEB3_SKILLS: Map<string, SkillInfo> = new Map();

/**
 * Web3知识库管理器类
 * 负责创建、加载、查询Web3知识库
 */
export class Web3KnowledgeManager {
  private knowledgeBase: Web3KnowledgeBase | null = null;
  private skillsEmbeddings: Map<string, number[]> = new Map();
  private apiKey: string | null = null;
  
  /**
   * 创建知识库管理器实例
   * @param apiKey 可选的API密钥，用于高级功能
   */
  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }
  
  /**
   * 创建新的知识库
   * @param name 知识库名称
   * @param description 知识库描述
   * @returns 创建的知识库
   */
  createKnowledgeBase(name: string, description?: string): Web3KnowledgeBase {
    const id = generateId();
    const now = new Date();
    
    const knowledgeBase: Web3KnowledgeBase = {
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      skills: [],
      resources: []
    };
    
    KNOWLEDGE_BASES.set(id, knowledgeBase);
    EMBEDDINGS.set(id, []);
    
    return knowledgeBase;
  }
  
  /**
   * 加载知识库
   * @param knowledgeBase 要加载的知识库
   */
  public async loadKnowledgeBase(knowledgeBase: Web3KnowledgeBase): Promise<void> {
    this.knowledgeBase = knowledgeBase;
    
    // 预先为所有技能生成嵌入向量
    if (knowledgeBase.skills) {
      for (const skill of knowledgeBase.skills) {
        const embedResult = await embedTextSafe(skill.name);
        this.skillsEmbeddings.set(skill.name, embedResult.embedding);
      }
    }
  }
  
  /**
   * 获取知识库列表
   */
  getKnowledgeBases(): Web3KnowledgeBase[] {
    return Array.from(KNOWLEDGE_BASES.values());
  }
  
  /**
   * 获取知识库详情
   * @param id 知识库ID
   */
  getKnowledgeBase(id: string): Web3KnowledgeBase | null {
    return KNOWLEDGE_BASES.get(id) || null;
  }
  
  /**
   * 从文本中提取技能
   * @param text 目标文本
   * @param threshold 相似度阈值
   * @returns 匹配到的技能列表
   */
  public async extractSkillsFromText(text: string, threshold = 0.75): Promise<string[]> {
    if (!this.knowledgeBase) {
      throw new Error('知识库未加载');
    }
    
    const embedResult = await embedTextSafe(text);
    const textEmbedding = embedResult.embedding;
    const matches: string[] = [];
    
    this.skillsEmbeddings.forEach((embedding, skill) => {
      const similarity = this.cosineSimilarity(textEmbedding, embedding);
      if (similarity >= threshold) {
        matches.push(skill);
      }
    });
    
    return matches;
  }
  
  /**
   * 获取技能相关知识
   * @param skillName 技能名称
   * @returns 技能详细信息
   */
  public getSkillKnowledge(skillName: string): any {
    if (!this.knowledgeBase) {
      throw new Error('知识库未加载');
    }
    
    if (this.knowledgeBase.skills) {
      const skill = this.knowledgeBase.skills.find(s => 
        s.name.toLowerCase() === skillName.toLowerCase()
      );
      
      if (skill) {
        return {
          ...skill
        };
      }
    }
    
    return null;
  }
  
  /**
   * 添加文本到知识库
   * @param knowledgeBaseId 知识库ID
   * @param text 要添加的文本
   * @param metadata 相关元数据
   */
  async addToKnowledgeBase(
    knowledgeBaseId: string,
    text: string,
    metadata?: Record<string, any>
  ): Promise<EmbeddingResult[]> {
    const knowledgeBase = KNOWLEDGE_BASES.get(knowledgeBaseId);
    if (!knowledgeBase) {
      throw new Error(`未找到ID为${knowledgeBaseId}的知识库`);
    }
    
    // 将文本分块
    const chunks = chunkText(text);
    const results: EmbeddingResult[] = [];
    
    // 为每个文本块创建嵌入
    for (const chunk of chunks) {
      const embedResult = await embedTextSafe(chunk);
      const result: EmbeddingResult = {
        text: chunk,
        embedding: embedResult.embedding,
        metadata
      };
      
      results.push(result);
    }
    
    // 将嵌入结果添加到知识库
    const currentEmbeddings = EMBEDDINGS.get(knowledgeBaseId) || [];
    EMBEDDINGS.set(knowledgeBaseId, [...currentEmbeddings, ...results]);
    
    // 更新知识库更新时间
    knowledgeBase.updatedAt = new Date();
    KNOWLEDGE_BASES.set(knowledgeBaseId, knowledgeBase);
    
    return results;
  }
  
  /**
   * 获取与查询相关的知识上下文
   * @param query 查询文本
   * @param maxResults 最大结果数
   * @returns 相关知识上下文
   */
  public async getKnowledgeContext(query: string, maxResults = 5): Promise<string> {
    if (!this.knowledgeBase) {
      throw new Error('知识库未加载');
    }
    
    const embedResult = await embedTextSafe(query);
    const queryEmbedding = embedResult.embedding;
    const results: Array<{text: string; similarity: number}> = [];
    
    // 搜索技能相关知识
    if (this.knowledgeBase.skills) {
      for (const skill of this.knowledgeBase.skills) {
        const skillEmbedding = skill.embedding || 
                              (await embedTextSafe(skill.name)).embedding;
        
        const similarity = this.cosineSimilarity(queryEmbedding, skillEmbedding);
        if (similarity > 0.6) {
          results.push({
            text: `${skill.name} (${skill.category}): ${skill.description}`,
            similarity
          });
        }
      }
    }
    
    // 搜索资源和路径信息
    if (this.knowledgeBase.resources) {
      for (const resource of this.knowledgeBase.resources) {
        const resourceText = resource.title + ' ' + resource.description;
        const resourceEmbedResult = await embedTextSafe(resourceText);
        const resourceEmbed = resourceEmbedResult.embedding;
        const similarity = this.cosineSimilarity(queryEmbedding, resourceEmbed);
        
        if (similarity > 0.6) {
          results.push({
            text: `资源: ${resource.title} - ${resource.description}`,
            similarity
          });
        }
      }
    }
    
    // 排序并格式化结果
    results.sort((a, b) => b.similarity - a.similarity);
    
    return results
      .slice(0, maxResults)
      .map(r => r.text)
      .join('\n\n');
  }
  
  /**
   * 查询知识库
   * @param knowledgeBaseId 知识库ID
   * @param query 查询文本
   * @param topK 返回的最大结果数
   */
  async queryKnowledgeBase(
    knowledgeBaseId: string,
    query: string,
    topK: number = 5
  ): Promise<QueryResult[]> {
    const embeddings = EMBEDDINGS.get(knowledgeBaseId);
    if (!embeddings || embeddings.length === 0) {
      return [];
    }
    
    // 为查询生成嵌入
    const embedResult = await embedTextSafe(query);
    const queryEmbedding = embedResult.embedding;
    
    // 计算相似度并排序
    const results = embeddings.map(embedding => {
      const similarity = this.cosineSimilarity(queryEmbedding, embedding.embedding);
      return {
        text: embedding.text,
        similarity,
        metadata: embedding.metadata
      };
    });
    
    // 按相似度排序并返回前topK个结果
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
  
  /**
   * 计算余弦相似度
   * @param vec1 向量1
   * @param vec2 向量2
   * @returns 余弦相似度
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('向量维度不匹配');
    }
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) {
      return 0;
    }
    
    return dotProduct / (mag1 * mag2);
  }
} 