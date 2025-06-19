import { Pinecone } from '@pinecone-database/pinecone';
import { VectorItem, PineconeConfig, PineconeSearchParams, PineconeIndexType } from './types';

/**
 * Pinecone向量数据库客户端
 * 封装了向量数据库的操作，提供向量存储和检索功能
 */
export class PineconeClient {
  private static client: Pinecone | null = null;
  private static jobIndexName: string | null = null;
  private static jobIndexHost: string | null = null;
  private static resumeIndexName: string | null = null;
  private static resumeIndexHost: string | null = null;
  private static isInitialized = false;
  private static defaultVectorDimension = 1024; // 默认向量维度

  /**
   * 初始化Pinecone客户端
   */
  static async init() {
    if (this.isInitialized) {
      return;
    }

    try {
      // 从环境变量获取配置
      const config: PineconeConfig = {
        apiKey: process.env.PINECONE_API_KEY || '',
        jobIndexName: process.env.PINECONE_JOB_INDEX_NAME || 'job-vectors',
        jobIndexHost: process.env.PINECONE_JOB_INDEX_HOST || 'https://job-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io',
        resumeIndexName: process.env.PINECONE_RESUME_INDEX_NAME || 'resume-vectors',
        resumeIndexHost: process.env.PINECONE_RESUME_INDEX_HOST || 'https://resume-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io',
      };

      if (!config.apiKey) {
        throw new Error('Pinecone API密钥不能为空，请检查环境变量');
      }

      // 初始化Pinecone SDK
      this.client = new Pinecone({
        apiKey: config.apiKey,
      });

      // 获取索引列表
      const indexList = await this.client.listIndexes();
      const indexNames = indexList?.indexes?.map(index => index.name) || [];
      
      // 检查索引是否存在
      const jobIndexName = config.jobIndexName || 'job-vectors';
      const jobIndexHost = config.jobIndexHost || 'https://job-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io';
      const resumeIndexName = config.resumeIndexName || 'resume-vectors';
      const resumeIndexHost = config.resumeIndexHost || 'https://resume-vectors-op5yqy8.svc.aped-4627-b74a.pinecone.io';
      
      if (!indexNames.includes(jobIndexName)) {
        throw new Error(`Pinecone岗位索引 ${jobIndexName} 不存在`);
      }
      
      if (!indexNames.includes(resumeIndexName)) {
        throw new Error(`Pinecone简历索引 ${resumeIndexName} 不存在`);
      }

      // 验证索引连接
      try {
        const jobIndex = this.client.index(jobIndexName, jobIndexHost);
        const resumeIndex = this.client.index(resumeIndexName, resumeIndexHost);
        
        // 测试连接
        const jobStats = await jobIndex.describeIndexStats();
        const resumeStats = await resumeIndex.describeIndexStats();
        
        console.log('岗位索引连接成功，向量数量:', jobStats.totalRecordCount);
        console.log('简历索引连接成功，向量数量:', resumeStats.totalRecordCount);
      } catch (connError) {
        throw new Error(`索引连接验证失败: ${(connError as Error).message}`);
      }

      this.jobIndexName = jobIndexName;
      this.jobIndexHost = jobIndexHost;
      this.resumeIndexName = resumeIndexName;
      this.resumeIndexHost = resumeIndexHost;
      this.isInitialized = true;

      console.log('Pinecone客户端初始化成功，岗位索引:', this.jobIndexName, '简历索引:', this.resumeIndexName);
    } catch (error) {
      console.error('Pinecone客户端初始化失败:', error);
      throw error;
    }
  }

  /**
   * 检查是否已初始化
   */
  private static checkInitialized() {
    if (!this.isInitialized || !this.client || !this.jobIndexName || !this.resumeIndexName) {
      throw new Error('Pinecone客户端未初始化，请先调用init()');
    }
  }

  /**
   * 根据索引类型获取索引实例
   * @param indexType 索引类型
   */
  private static getIndex(indexType: PineconeIndexType = PineconeIndexType.JOB) {
    this.checkInitialized();
    const indexName = indexType === PineconeIndexType.JOB ? this.jobIndexName : this.resumeIndexName;
    const indexHost = indexType === PineconeIndexType.JOB ? this.jobIndexHost : this.resumeIndexHost;
    return this.client!.index(indexName!, indexHost!);
  }

  /**
   * 判断向量ID属于哪种索引类型
   * @param id 向量ID
   */
  private static getIndexTypeFromId(id: string): PineconeIndexType {
    if (id.startsWith('job_')) {
      return PineconeIndexType.JOB;
    } else if (id.startsWith('resume_')) {
      return PineconeIndexType.RESUME;
    } else {
      console.warn(`向量ID ${id} 格式不符合规范，将使用岗位索引作为默认值`);
      return PineconeIndexType.JOB;
    }
  }

  /**
   * 验证向量数据
   * @param item 向量数据
   */
  private static validateVectorItem(item: VectorItem): void {
    if (!item.id) {
      throw new Error('向量ID不能为空');
    }
    
    if (!Array.isArray(item.vector) || item.vector.length === 0) {
      throw new Error(`向量数据不能为空 (ID: ${item.id})`);
    }
    
    // 检查向量维度是否合理
    if (item.vector.length !== this.defaultVectorDimension) {
      console.warn(`向量 ${item.id} 的维度(${item.vector.length})与默认维度(${this.defaultVectorDimension})不符`);
    }
    
    // 检查向量中是否有非数字值
    if (!item.vector.every(val => typeof val === 'number' && !isNaN(val))) {
      throw new Error(`向量 ${item.id} 包含非数字值`);
    }
  }

  /**
   * 插入或更新向量
   * @param item 向量数据
   */
  static async upsert(item: VectorItem) {
    this.checkInitialized();
    
    // 验证向量数据
    this.validateVectorItem(item);
    
    // 根据ID前缀判断索引类型
    const indexType = this.getIndexTypeFromId(item.id);
    const index = this.getIndex(indexType);

    try {
      // 转换为Pinecone记录格式
      const record = {
        id: item.id,
        values: item.vector,
        metadata: item.metadata
      };

      await index.upsert([record]);
    } catch (error) {
      console.error(`向量插入或更新失败(ID: ${item.id}):`, error);
      throw new Error(`向量操作失败: ${(error as Error).message}`);
    }
  }

  /**
   * 批量插入或更新向量
   * @param items 向量数据列表
   * @param batchSize 批量大小，默认100
   */
  static async batchUpsert(items: VectorItem[], batchSize = 100) {
    this.checkInitialized();
    
    if (!items || items.length === 0) {
      console.warn('批量插入向量为空');
      return;
    }
    
    // 验证所有向量数据
    for (const item of items) {
      this.validateVectorItem(item);
    }
    
    // 将向量按索引类型分组
    const jobVectors: VectorItem[] = [];
    const resumeVectors: VectorItem[] = [];
    
    items.forEach(item => {
      if (item.id.startsWith('job_')) {
        jobVectors.push(item);
      } else if (item.id.startsWith('resume_')) {
        resumeVectors.push(item);
      } else {
        console.warn(`向量ID ${item.id} 格式不符合规范，将跳过该向量`);
      }
    });

    const upsertPromises: Promise<any>[] = [];

    // 处理岗位向量
    if (jobVectors.length > 0) {
      const jobIndex = this.getIndex(PineconeIndexType.JOB);
      
      // 将数据分批处理
      for (let i = 0; i < jobVectors.length; i += batchSize) {
        const batch = jobVectors.slice(i, i + batchSize);
        
        // 转换为Pinecone记录格式
        const records = batch.map(item => ({
          id: item.id,
          values: item.vector,
          metadata: item.metadata
        }));

        // 添加到Promise队列
        upsertPromises.push(
          jobIndex.upsert(records)
            .catch(error => {
              console.error(`岗位向量批量插入失败(批次 ${i / batchSize + 1}/${Math.ceil(jobVectors.length / batchSize)}):`, error);
              throw error;
            })
        );
      }
    }
    
    // 处理简历向量
    if (resumeVectors.length > 0) {
      const resumeIndex = this.getIndex(PineconeIndexType.RESUME);
      
      // 将数据分批处理
      for (let i = 0; i < resumeVectors.length; i += batchSize) {
        const batch = resumeVectors.slice(i, i + batchSize);
        
        // 转换为Pinecone记录格式
        const records = batch.map(item => ({
          id: item.id,
          values: item.vector,
          metadata: item.metadata
        }));

        // 添加到Promise队列
        upsertPromises.push(
          resumeIndex.upsert(records)
            .catch(error => {
              console.error(`简历向量批量插入失败(批次 ${i / batchSize + 1}/${Math.ceil(resumeVectors.length / batchSize)}):`, error);
              throw error;
            })
        );
      }
    }
    
    // 并行执行所有upsert操作
    try {
      await Promise.all(upsertPromises);
      console.log(`批量向量插入完成，成功处理 ${jobVectors.length} 条岗位向量和 ${resumeVectors.length} 条简历向量`);
    } catch (error) {
      console.error('批量向量插入过程中发生错误:', error);
      throw new Error(`批量向量插入失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取向量
   * @param id 向量ID，jobs_xxx | resume_xxx
   * @returns 向量数据，如果不存在则返回null
   */
  static async fetch(id: string): Promise<VectorItem | null> {
    this.checkInitialized();
    
    if (!id) {
      throw new Error('向量ID不能为空');
    }
    
    // 根据ID前缀判断索引类型
    const indexType = this.getIndexTypeFromId(id);
    const index = this.getIndex(indexType);

    try {
      const response = await index.fetch([id]);

      if (!response.records[id]) {
        return null;
      }

      const record = response.records[id];
      
      return {
        id,
        vector: Array.isArray(record.values) ? record.values : [],
        metadata: record.metadata || {}
      };
    } catch (error) {
      console.error(`获取向量失败(ID: ${id}):`, error);
      throw new Error(`获取向量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 向量相似度搜索
   * @param params 搜索参数
   * @returns 相似向量列表
   */
  static async search(params: PineconeSearchParams) {
    this.checkInitialized();
    
    // 参数验证
    if (!params.vector || !Array.isArray(params.vector) || params.vector.length === 0) {
      throw new Error('搜索向量不能为空');
    }
    
    if (params.vector.length !== this.defaultVectorDimension) {
      console.warn(`搜索向量维度(${params.vector.length})与默认维度(${this.defaultVectorDimension})不符`);
    }
    
    // 参数处理
    const topK = Math.min(Math.max(1, params.topK || 10), 10000); // 最小1，最大10000
    const minScore = params.minScore || 0;
    
    // 获取指定的索引类型
    const indexType = params.indexType || PineconeIndexType.JOB;
    const index = this.getIndex(indexType);

    try {
      const response = await index.query({
        vector: params.vector,
        topK: topK,
        filter: params.filter || {},
        includeMetadata: true,
      });

      // 过滤低于阈值的结果
      return response.matches
        .filter(match => !minScore || (typeof match.score === 'number' && match.score >= minScore))
        .map(match => ({
          id: match.id,
          score: match.score || 0,
          metadata: match.metadata || {}
        }));
    } catch (error) {
      console.error(`向量搜索失败(${indexType}索引):`, error);
      throw new Error(`向量搜索失败: ${(error as Error).message}`);
    }
  }

  /**
   * 删除向量
   * @param id 向量ID
   */
  static async delete(id: string) {
    this.checkInitialized();
    
    if (!id) {
      throw new Error('向量ID不能为空');
    }
    
    // 根据ID前缀判断索引类型
    const indexType = this.getIndexTypeFromId(id);
    const index = this.getIndex(indexType);

    try {
      await index.deleteOne(id);
    } catch (error) {
      console.error(`删除向量失败(ID: ${id}):`, error);
      throw new Error(`删除向量失败: ${(error as Error).message}`);
    }
  }

  /**
   * 批量删除向量
   * @param ids 向量ID列表
   */
  static async batchDelete(ids: string[]) {
    this.checkInitialized();
    
    if (!ids || ids.length === 0) {
      console.warn('批量删除向量ID列表为空');
      return;
    }
    
    // 将ID按索引类型分组
    const jobIds: string[] = [];
    const resumeIds: string[] = [];
    const invalidIds: string[] = [];
    
    ids.forEach(id => {
      if (id.startsWith('job_')) {
        jobIds.push(id);
      } else if (id.startsWith('resume_')) {
        resumeIds.push(id);
      } else {
        invalidIds.push(id);
      }
    });
    
    if (invalidIds.length > 0) {
      console.warn(`发现 ${invalidIds.length} 个格式不符合规范的ID，这些ID将被跳过:`, invalidIds);
    }
    
    const deletePromises: Promise<any>[] = [];
    
    // 删除岗位向量
    if (jobIds.length > 0) {
      const jobIndex = this.getIndex(PineconeIndexType.JOB);
      deletePromises.push(
        jobIndex.deleteMany([...jobIds])
          .catch(error => {
            console.error(`批量删除岗位向量失败(${jobIds.length}条):`, error);
            throw error;
          })
      );
    }
    
    // 删除简历向量
    if (resumeIds.length > 0) {
      const resumeIndex = this.getIndex(PineconeIndexType.RESUME);
      deletePromises.push(
        resumeIndex.deleteMany([...resumeIds])
          .catch(error => {
            console.error(`批量删除简历向量失败(${resumeIds.length}条):`, error);
            throw error;
          })
      );
    }
    
    // 并行执行所有删除操作
    try {
      await Promise.all(deletePromises);
      console.log(`批量删除完成，成功处理 ${jobIds.length} 条岗位向量和 ${resumeIds.length} 条简历向量`);
    } catch (error) {
      console.error('批量删除过程中发生错误:', error);
      throw new Error(`批量删除失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取索引统计信息
   * @param indexType 索引类型
   * @returns 索引统计信息
   */
  static async describeIndexStats(indexType: PineconeIndexType = PineconeIndexType.JOB) {
    this.checkInitialized();
    const index = this.getIndex(indexType);

    try {
      const status = await index.describeIndexStats();
      return status;
    } catch (error) {
      console.error(`获取索引统计信息失败(${indexType}索引):`, error);
      throw new Error(`获取索引统计信息失败: ${(error as Error).message}`);
    }
  }
} 