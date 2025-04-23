import { ResumeData } from '../types';
import { parseResume } from '../parser';
import { parseResumeWithAI as aiParserImpl } from './ai-parser';
import { 
  setupWeb3KnowledgeBase,
  queryWeb3Knowledge, 
  getWeb3KnowledgeManager 
} from './web3-knowledge';

// 导出 Web3 知识库相关功能
export { queryWeb3Knowledge, getWeb3KnowledgeManager, setupWeb3KnowledgeBase };

/**
 * 使用AI解析简历
 * @param file - 简历文件
 * @returns 解析后的简历数据或错误信息
 */
export async function parseResumeWithAI(
  file: File
): Promise<{ data?: ResumeData; error?: string }> {
  return aiParserImpl(file);
}

/**
 * 从文件中提取文本内容
 * @param file - 文件对象
 * @param onProgress - 进度回调函数
 * @returns 文件内容和提取结果
 */
export async function extractTextFromFile(
  file: File,
  onProgress?: (progress: number, step: string) => void
): Promise<{ content: string; error?: string }> {
  try {
    const progressCallback = onProgress || (() => {});
    
    // 文件格式检查
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !['pdf', 'docx', 'doc', 'txt'].includes(fileType)) {
      return { 
        content: '',
        error: `不支持的文件格式: ${fileType}。请上传PDF或DOCX文件。`
      };
    }
    
    // 报告进度 - 开始文本提取
    progressCallback(10, '正在提取文本内容...');
    
    // 调用传统解析器提取文本
    const result = await parseResume(file);
    if (result.error) {
      return {
        content: '',
        error: result.error
      };
    }
    
    if (!result.data) {
      return {
        content: '',
        error: '从文件中提取的文本内容为空'
      };
    }
    
    // 报告进度 - 文本提取完成
    progressCallback(20, '文本提取完成');
    
    return { content: result.data.rawText };
    
  } catch (error) {
    console.error('文件处理错误:', error);
    return { 
      content: '',
      error: `文件处理错误: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// 为了向后兼容，保留旧的导出名称
export { parseResumeWithAI as aiParserFunction }; 