/**
 * AgentWrapper类
 * 封装对OpenRouter的调用，模拟Mastra的功能
 */
export class AgentWrapper {
  private readonly apiKey: string | null;
  private memory: Map<string, string[]> = new Map();
  
  constructor() {
    // 从环境变量获取API密钥
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || null;
  }
  
  /**
   * 处理提示并返回结果
   * @param prompt - 用户提示
   * @param context - 可选的RAG检索上下文
   * @returns 处理结果
   */
  async process(prompt: string, context?: string): Promise<string> {
    // 如果没有API密钥，返回错误
    if (!this.apiKey) {
      console.error('Agent未配置API密钥');
      return JSON.stringify({
        error: '未配置API密钥'
      });
    }
    
    try {
      // 构建包含RAG上下文的消息
      const messages = this.buildChatMessages(prompt, context);
      
      // 调用OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://blockrecruitment.com',
          'X-Title': 'Block Recruitment App'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages,
          temperature: 0.2
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API响应错误: ${errorData.error?.message || '未知错误'}`);
      }
      
      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || '';
      
      // 更新记忆
      this.updateMemory(prompt, text);
      
      return text;
      
    } catch (error) {
      console.error('Agent处理错误:', error);
      return JSON.stringify({
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }
  
  /**
   * 批量处理多个提示
   * @param prompts - 提示数组
   * @returns 处理结果数组
   */
  async batchProcess(prompts: string[]): Promise<string[]> {
    const results: string[] = [];
    
    for (const prompt of prompts) {
      try {
        const result = await this.process(prompt);
        results.push(result);
      } catch (error) {
        console.error('批处理单个提示错误:', error);
        results.push(JSON.stringify({
          error: error instanceof Error ? error.message : '未知错误'
        }));
      }
    }
    
    return results;
  }
  
  /**
   * 处理RAG增强的提示
   * @param prompt - 主要提示
   * @param resumeData - 简历数据
   * @param ragContext - RAG检索上下文
   */
  async processWithRAG(prompt: string, ragContext: string): Promise<string> {
    return this.process(prompt, ragContext);
  }
  
  /**
   * 生成聊天消息数组，包含上下文记忆
   */
  private buildChatMessages(prompt: string, context?: string): Array<{role: string, content: string}> {
    const messages: Array<{role: string, content: string}> = [];
    
    // 确定提示的类型
    const contextKey = this.getContextKey(prompt);
    
    // 添加系统消息
    messages.push({
      role: 'system',
      content: this.getSystemPrompt(contextKey)
    });
    
    // 添加记忆中的消息
    const memoryMessages = this.memory.get(contextKey) || [];
    for (let i = 0; i < memoryMessages.length; i += 2) {
      if (i + 1 < memoryMessages.length) {
        messages.push({ role: 'user', content: memoryMessages[i] });
        messages.push({ role: 'assistant', content: memoryMessages[i + 1] });
      }
    }
    
    // 添加RAG上下文作为系统消息
    if (context) {
      messages.push({
        role: 'system',
        content: `以下是可能有助于回答的上下文信息:\n\n${context}`
      });
    }
    
    // 添加当前提示
    messages.push({ role: 'user', content: prompt });
    
    return messages;
  }
  
  /**
   * 根据提示内容选择合适的系统提示
   */
  private getSystemPrompt(contextKey: string): string {
    if (contextKey === 'resume') {
      return `你是一个专业的简历解析AI助手，专门分析简历内容并提取重要信息。
特别擅长识别技能、教育背景、工作经验和项目经历。当识别到Web3和区块链相关技能或经验时，
请特别关注并提供更详细的分析。请以JSON格式返回结果，保持结构清晰。`;
    }
    
    if (contextKey === 'evaluation') {
      return `你是一个专业的人才评估AI助手，擅长比较职位要求和候选人资质。
你需要根据职位要求评估候选人的技能匹配度、经验相关性和总体适合度。
特别关注Web3、区块链和加密货币领域的专业知识。请以JSON格式返回评估结果，包括总体评分和各项分数。`;
    }
    
    // 默认系统提示
    return `你是一个专业的AI助手，负责回答用户问题并提供准确信息。`;
  }
  
  /**
   * 根据提示内容确定上下文类别
   */
  private getContextKey(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('简历') || 
        lowerPrompt.includes('提取') || 
        lowerPrompt.includes('resume') ||
        lowerPrompt.includes('职业经历')) {
      return 'resume';
    }
    
    if (lowerPrompt.includes('评估') || 
        lowerPrompt.includes('评分') || 
        lowerPrompt.includes('匹配') ||
        lowerPrompt.includes('适合度')) {
      return 'evaluation';
    }
    
    return 'general';
  }
  
  /**
   * 更新对话记忆
   */
  private updateMemory(prompt: string, response: string): void {
    const contextKey = this.getContextKey(prompt);
    const messages = this.memory.get(contextKey) || [];
    
    // 添加新的消息
    messages.push(prompt, response);
    
    // 限制记忆长度，保留最新的5轮对话
    if (messages.length > 10) {
      messages.splice(0, messages.length - 10);
    }
    
    this.memory.set(contextKey, messages);
  }
} 