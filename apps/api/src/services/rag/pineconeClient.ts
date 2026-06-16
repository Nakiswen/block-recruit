import { Pinecone, Index } from '@pinecone-database/pinecone';
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
  private static maxRetries = 3; // 最大重试次数
  private static retryDelay = 1000; // 重试延迟(毫秒)

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
        jobIndexHost: process.env.PINECONE_JOB_INDEX_HOST || '',
        resumeIndexName: process.env.PINECONE_RESUME_INDEX_NAME || 'resume-vectors',
        resumeIndexHost: process.env.PINECONE_RESUME_INDEX_HOST || '',
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
      const jobIndexHost = config.jobIndexHost;
      const resumeIndexName = config.resumeIndexName || 'resume-vectors';
      const resumeIndexHost = config.resumeIndexHost;

      if (!indexNames.includes(jobIndexName)) {
        throw new Error(`Pinecone岗位索引 ${jobIndexName} 不存在`);
      }

      if (!indexNames.includes(resumeIndexName)) {
        throw new Error(`Pinecone简历索引 ${resumeIndexName} 不存在`);
      }

      if (!jobIndexHost || !resumeIndexHost) {
        throw new Error('PINECONE_JOB_INDEX_HOST 和 PINECONE_RESUME_INDEX_HOST 不能为空');
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

      console.log(
        'Pinecone客户端初始化成功，岗位索引:',
        this.jobIndexName,
        '简历索引:',
        this.resumeIndexName
      );
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
  private static getIndex(indexType: PineconeIndexType = PineconeIndexType.JOB): Index {
    this.checkInitialized();
    const indexName =
      indexType === PineconeIndexType.JOB ? this.jobIndexName : this.resumeIndexName;
    const indexHost =
      indexType === PineconeIndexType.JOB ? this.jobIndexHost : this.resumeIndexHost;
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
      console.warn(
        `向量 ${item.id} 的维度(${item.vector.length})与默认维度(${this.defaultVectorDimension})不符`
      );
    }

    // 检查向量中是否有非数字值
    if (!item.vector.every(val => typeof val === 'number' && !isNaN(val))) {
      throw new Error(`向量 ${item.id} 包含非数字值`);
    }
  }

  /**
   * 带重试机制的操作执行器
   * @param operation 要执行的操作函数
   * @param id 操作相关的ID(用于日志)
   */
  private static async executeWithRetry<T>(operation: () => Promise<T>, id: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error as Error;
        const isNetworkError =
          error.message.includes('failed to reach') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('socket disconnected') ||
          error.message.includes('network problem');

        // 只有网络错误才重试
        if (isNetworkError && attempt < this.maxRetries) {
          console.warn(`向量操作失败(ID: ${id})，第${attempt}次重试，错误:`, error.message);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
          continue;
        }

        throw error;
      }
    }

    throw lastError!;
  }

  /**
   * 插入或更新向量
   * @param item 向量数据
   * @param indexType 可选的索引类型，如果提供则覆盖ID自动检测
   * @returns 操作结果对象，包含成功状态和详细信息
   */
  static async upsert(
    item: VectorItem,
    indexType?: PineconeIndexType
  ): Promise<{
    success: boolean;
    count: number;
    data?: any;
    error?: string;
  }> {
    this.checkInitialized();

    // 验证向量数据
    try {
      this.validateVectorItem(item);
    } catch (error) {
      return {
        success: false,
        count: 0,
        error: `向量验证失败: ${(error as Error).message}`,
      };
    }

    // 根据ID前缀判断索引类型，如果提供了明确的索引类型则使用它
    const actualIndexType = indexType || this.getIndexTypeFromId(item.id);
    const index = this.getIndex(actualIndexType);

    try {
      // 转换为Pinecone记录格式
      const record = {
        id: item.id,
        values: item.vector,
        metadata: item.metadata,
      };

      const response = await this.executeWithRetry(() => index.upsert([record]), item.id);

      // 判断操作是否成功
      const success = true; // 如果执行到这里没有抛出异常，就认为成功了
      const count = 1; // 单条插入成功就是1

      console.log(
        `${success ? '✅' : '❌'} ${actualIndexType} 向量 ${item.id} ${success ? '上传成功' : '上传失败'}`
      );

      // 返回标准格式的结果
      return {
        success,
        count,
        data: response,
      };
    } catch (error: any) {
      console.error(`向量插入或更新失败(ID: ${item.id}):`, error);

      // 根据错误类型给出不同的处理建议
      let suggestion = '';
      if (error.message.includes('timeout')) {
        suggestion = '网络超时，可以重试';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        suggestion = '配额不足或达到限制，检查账户设置';
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        suggestion = '检查API密钥权限是否正确';
      } else if (error.message.includes('dimension')) {
        suggestion = '向量维度不匹配，检查向量生成配置';
      } else if (error.message.includes('connection') || error.message.includes('network')) {
        suggestion = '网络连接问题，检查网络或重试';
      } else {
        suggestion = '未知错误，请检查日志';
      }

      console.log(`💡 建议：${suggestion}`);

      // 返回统一格式的错误结果
      return {
        success: false,
        count: 0,
        error: `${error.message} (建议: ${suggestion})${error.cause ? ` - 原因: ${error.cause}` : ''}`,
      };
    }
  }

  /**
   * 批量插入或更新向量
   * @param items 向量数据数组
   * @param batchSize 批处理大小，默认100
   * @returns 操作结果对象，包含成功状态和详细信息
   */
  static async batchUpsert(
    items: VectorItem[],
    batchSize = 100
  ): Promise<{
    success: boolean;
    count: number;
    data?: any;
    error?: string;
    errors?: string[];
  }> {
    this.checkInitialized();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        success: false,
        count: 0,
        error: '向量数据列表为空',
      };
    }

    // 按照索引类型分组
    const jobVectors: VectorItem[] = [];
    const resumeVectors: VectorItem[] = [];

    // 对每个向量进行验证并分组
    const failedItems: { id: string; error: string }[] = [];

    items.forEach(item => {
      try {
        this.validateVectorItem(item);

        if (item.id.startsWith('job_')) {
          jobVectors.push(item);
        } else if (item.id.startsWith('resume_')) {
          resumeVectors.push(item);
        } else {
          // 默认使用岗位索引
          console.warn(`向量ID ${item.id} 格式不规范，将默认使用岗位索引`);
          jobVectors.push(item);
        }
      } catch (error) {
        failedItems.push({
          id: item.id || '未知ID',
          error: error instanceof Error ? error.message : '未知错误',
        });
      }
    });

    // 处理验证失败的情况
    if (failedItems.length === items.length) {
      return {
        success: false,
        count: 0,
        error: '所有向量数据验证失败',
        errors: failedItems.map(item => `ID ${item.id}: ${item.error}`),
      };
    }

    // 处理结果统计
    let successCount = 0;
    const errors: string[] = [];
    let hasError = false;

    // 批量处理岗位向量
    if (jobVectors.length > 0) {
      try {
        const result = await this.batchUpsertToIndex(jobVectors, PineconeIndexType.JOB, batchSize);
        successCount += result.success ? result.count : 0;
        if (!result.success) {
          hasError = true;
          errors.push(`岗位向量批量插入失败: ${result.error}`);
        }
      } catch (error) {
        hasError = true;
        errors.push(
          `岗位向量批量插入发生异常: ${error instanceof Error ? error.message : '未知错误'}`
        );
      }
    }

    // 批量处理简历向量
    if (resumeVectors.length > 0) {
      try {
        const result = await this.batchUpsertToIndex(
          resumeVectors,
          PineconeIndexType.RESUME,
          batchSize
        );
        successCount += result.success ? result.count : 0;
        if (!result.success) {
          hasError = true;
          errors.push(`简历向量批量插入失败: ${result.error}`);
        }
      } catch (error) {
        hasError = true;
        errors.push(
          `简历向量批量插入发生异常: ${error instanceof Error ? error.message : '未知错误'}`
        );
      }
    }

    // 添加验证失败的错误
    if (failedItems.length > 0) {
      hasError = true;
      errors.push(...failedItems.map(item => `ID ${item.id}: 验证失败 - ${item.error}`));
    }

    // 返回最终结果
    console.log(`📊 批量向量操作完成: ${successCount}/${items.length} 成功`);

    if (errors.length > 0) {
      console.log(`❌ 错误信息: ${errors.join('; ')}`);
    }

    return {
      success: !hasError && successCount > 0,
      count: successCount,
      data: {
        totalItems: items.length,
        jobVectorsCount: jobVectors.length,
        resumeVectorsCount: resumeVectors.length,
        failedValidationCount: failedItems.length,
      },
      error: hasError ? `${errors.length} 个错误发生` : undefined,
      errors: hasError ? errors : undefined,
    };
  }

  /**
   * 根据ID获取向量
   * @param id 向量ID
   */
  static async fetch(id: string): Promise<VectorItem | null> {
    this.checkInitialized();

    // 根据ID前缀判断索引类型
    const indexType = this.getIndexTypeFromId(id);
    const index = this.getIndex(indexType);

    try {
      const result = await this.executeWithRetry(() => index.fetch([id]), id);

      if (!result.records || !result.records[id]) {
        return null;
      }

      const record = result.records[id];

      // 确保向量数据是数组
      const values = Array.isArray(record.values) ? record.values : [];

      return {
        id,
        vector: values,
        metadata: record.metadata as Record<string, any>,
      };
    } catch (error: any) {
      // 如果是"记录不存在"错误，则返回null
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return null;
      }

      console.error(`向量获取失败(ID: ${id}):`, error);
      throw new Error(`向量获取失败: ${error.message}`);
    }
  }

  /**
   * 向量相似度搜索
   * @param params 搜索参数
   * @returns 搜索结果，包含匹配项和元数据
   */
  static async search(params: PineconeSearchParams): Promise<{
    success: boolean;
    count: number;
    matches: Array<{
      id: string;
      score: number;
      metadata: Record<string, any>;
      values?: number[];
    }>;
    searchTimeMs: number;
    data?: any;
    error?: string;
  }> {
    this.checkInitialized();

    // 根据查询类型决定使用哪个索引
    const indexType = params.indexType || PineconeIndexType.JOB;
    const index = this.getIndex(indexType);

    // 验证查询向量
    if (!Array.isArray(params.vector) || params.vector.length !== this.defaultVectorDimension) {
      return {
        success: false,
        count: 0,
        matches: [],
        searchTimeMs: 0,
        error: `查询向量无效: 要求${this.defaultVectorDimension}维度，实际${params.vector?.length || 0}维度`,
      };
    }

    // 计时开始
    const startTime = Date.now();

    try {
      const queryOptions = {
        vector: params.vector,
        topK: params.topK || 10,
        includeValues: params.includeValues || false,
        includeMetadata: true,
        filter: params.filter,
      };

      console.log('🚀 ~ PineconeClient ~ search ~ queryOptions:', queryOptions);

      // 执行查询
      const response = await this.executeWithRetry(() => index.query(queryOptions), 'search-query');

      // 计算耗时
      const endTime = Date.now();
      const searchTimeMs = endTime - startTime;

      // 处理和标准化匹配结果
      const matches =
        response.matches?.map((match, i) => {
          console.log(`\n${i + 1}. ${match.id}`);
          console.log(`   metadata 字段:`, Object.keys(match.metadata || {}));
          console.log(`   完整 metadata:`, JSON.stringify(match.metadata, null, 2));
          return {
            id: match.id,
            score: match.score || 0,
            metadata: match.metadata || {},
            values: queryOptions.includeValues ? match.values : undefined,
          };
        }) || [];

      console.log(
        `✅ ${indexType} 向量搜索完成，找到 ${matches.length} 条结果，用时 ${searchTimeMs}ms`
      );

      // 返回标准格式的结果
      return {
        success: true,
        count: matches.length,
        matches,
        searchTimeMs,
        data: response,
      };
    } catch (error: any) {
      // 计算耗时(虽然失败)
      const endTime = Date.now();
      const searchTimeMs = endTime - startTime;

      console.error(`向量搜索失败:`, error);

      // 根据错误类型给出不同的处理建议
      let suggestion = '';
      if (error.message.includes('timeout')) {
        suggestion = '查询超时，可以尝试减小topK值或简化过滤条件';
      } else if (error.message.includes('filter')) {
        suggestion = '过滤条件可能格式不正确，请检查filter对象语法';
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        suggestion = '检查API密钥权限是否正确';
      } else if (error.message.includes('connection') || error.message.includes('network')) {
        suggestion = '网络连接问题，检查网络或重试';
      } else if (error.message.includes('invalid properties')) {
        suggestion = 'API参数错误，请检查Pinecone SDK版本兼容性';
      } else {
        suggestion = '未知错误，请检查日志';
      }

      console.log(`💡 建议：${suggestion}`);

      // 返回统一格式的错误结果
      return {
        success: false,
        count: 0,
        matches: [],
        searchTimeMs,
        error: `${error.message} (建议: ${suggestion})${error.cause ? ` - 原因: ${error.cause}` : ''}`,
      };
    }
  }

  /**
   * 删除向量
   * @param id 向量ID
   * @returns 操作结果对象，包含成功状态和详细信息
   */
  static async delete(id: string): Promise<{
    success: boolean;
    count: number;
    data?: any;
    error?: string;
  }> {
    this.checkInitialized();

    if (!id) {
      return {
        success: false,
        count: 0,
        error: '向量ID不能为空',
      };
    }

    // 根据ID前缀判断索引类型
    const indexType = this.getIndexTypeFromId(id);
    const index = this.getIndex(indexType);

    try {
      // 执行删除操作
      const response = await this.executeWithRetry(() => index.deleteOne(id), id);

      // 删除成功
      console.log(`✅ ${indexType} 向量 ${id} 删除成功`);

      // 返回标准格式的结果
      return {
        success: true,
        count: 1,
        data: response,
      };
    } catch (error: any) {
      console.error(`删除向量 ${id} 失败:`, error);

      // 根据错误类型给出不同的处理建议
      let suggestion = '';
      if (error.message.includes('not found') || error.message.includes('不存在')) {
        suggestion = '向量ID不存在，可能已被删除';
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        suggestion = '检查API密钥权限是否正确';
      } else if (error.message.includes('connection') || error.message.includes('network')) {
        suggestion = '网络连接问题，检查网络或重试';
      } else {
        suggestion = '未知错误，请检查日志';
      }

      console.log(`💡 建议：${suggestion}`);

      // 返回统一格式的错误结果
      return {
        success: false,
        count: 0,
        error: `${error.message} (建议: ${suggestion})${error.cause ? ` - 原因: ${error.cause}` : ''}`,
      };
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
        jobIndex.deleteMany([...jobIds]).catch(error => {
          console.error(`批量删除岗位向量失败(${jobIds.length}条):`, error);
          throw error;
        })
      );
    }

    // 删除简历向量
    if (resumeIds.length > 0) {
      const resumeIndex = this.getIndex(PineconeIndexType.RESUME);
      deletePromises.push(
        resumeIndex.deleteMany([...resumeIds]).catch(error => {
          console.error(`批量删除简历向量失败(${resumeIds.length}条):`, error);
          throw error;
        })
      );
    }

    // 并行执行所有删除操作
    try {
      await Promise.all(deletePromises);
      console.log(
        `批量删除完成，成功处理 ${jobIds.length} 条岗位向量和 ${resumeIds.length} 条简历向量`
      );
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

  /**
   * 将向量批量插入到指定的索引中
   * @param vectors 向量数据数组
   * @param indexType 索引类型
   * @param batchSize 批处理大小
   * @returns 批处理结果
   */
  private static async batchUpsertToIndex(
    vectors: VectorItem[],
    indexType: PineconeIndexType,
    batchSize: number
  ): Promise<{
    success: boolean;
    count: number;
    error?: string;
  }> {
    if (vectors.length === 0) {
      return { success: true, count: 0 };
    }

    const index = this.getIndex(indexType);
    const errors: string[] = [];
    let successCount = 0;

    try {
      // 分批处理向量
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        const batchId = `${indexType}_batch_${i}`;

        // 转换为Pinecone记录格式
        const records = batch.map(item => ({
          id: item.id,
          values: item.vector,
          metadata: item.metadata,
        }));

        try {
          // 使用重试机制执行批量操作
          await this.executeWithRetry(() => index.upsert(records), batchId);
          successCount += batch.length;
          console.log(
            `✅ 批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)} 插入成功: ${batch.length} 条`
          );
        } catch (error) {
          const errorMsg = `批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)} 失败: ${error instanceof Error ? error.message : '未知错误'}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }

      // 判断整体结果
      const success = successCount > 0;
      console.log(`📊 ${indexType} 向量批量操作: ${successCount}/${vectors.length} 成功`);

      return {
        success,
        count: successCount,
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    } catch (error) {
      console.error(`批量操作总体失败(${indexType}):`, error);
      return {
        success: false,
        count: successCount,
        error: `批量操作失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }
}
