// 使用更简单的声明方式
declare module 'pdfjs-dist/build/pdf';
declare module 'pdfjs-dist/build/pdf.worker.entry';

import { ResumeData } from '../types';
import { parseResume } from '../parser';
import * as mammoth from 'mammoth';
import { setupWeb3KnowledgeBase } from './web3-knowledge';
import { runWorkflow, WorkflowInput, Agent } from './workflow';
import { AgentWrapper } from './agent-wrapper';

// 使用Mastra封装的批处理API客户端
class ApiAgent implements Agent {
  private mastraAgent: AgentWrapper | null = null;
  private batchPrompts: string[] = [];
  private batchResponses: string[] = [];
  
  constructor(apiUrl = '/api/ai') {
    // 初始化Mastra代理
    this.mastraAgent = new AgentWrapper();
  }
  
  async generateText(prompt: string): Promise<string> {
    try {
      // 确保Mastra代理已初始化
      if (!this.mastraAgent) {
        this.mastraAgent = new AgentWrapper();
      }
      
      // 使用Mastra处理提示
      const response = await this.mastraAgent.process(prompt);
      return response;
      
    } catch (error) {
      console.error('Mastra AI生成文本失败:', error);
      // 返回一个简单的回退响应
      return JSON.stringify({
        name: "解析失败",
        email: "",
        skills: []
      });
    }
  }
}

/**
 * 使用AI解析简历
 * @param file - 简历文件
 * @returns 解析后的简历数据或错误信息
 */
export async function parseResumeWithAI(
  file: File
): Promise<{ data?: ResumeData; error?: string }> {
  try {
    const progressCallback = (progress: number, step: string) => {
      console.log(`解析进度: ${progress}%, 步骤: ${step}`);
    };
    const errorCallback = (error: string) => {
      console.error('解析错误:', error);
    };
    
    // 验证文件类型
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !['pdf', 'docx', 'doc', 'txt'].includes(fileType)) {
      const error = `不支持的文件格式: ${fileType}。请上传PDF或DOCX文件。`;
      errorCallback(error);
      return { error };
    }
    
    // 报告进度 - 开始提取文本
    progressCallback(10, '正在提取文本内容...');
    
    // 从文件中提取文本
    let fileContent = '';
    try {
      if (fileType === 'pdf') {
        fileContent = await extractPdfText(file);
      } else if (['docx', 'doc'].includes(fileType)) {
        fileContent = await extractDocxText(file);
      } else if (fileType === 'txt') {
        fileContent = await file.text();
      }
    } catch (err) {
      const error = `文本提取失败: ${err instanceof Error ? err.message : String(err)}`;
      errorCallback(error);
      return { error };
    }
    
    if (!fileContent || fileContent.trim().length === 0) {
      const error = '从文件中提取的文本内容为空';
      errorCallback(error);
      return { error };
    }
    
    // 报告进度 - 文本提取完成，开始AI解析
    progressCallback(30, '正在使用AI分析简历内容...');
    
    // 创建API代理
    const apiAgent = new ApiAgent();
    
    // 初始化 Web3 RAG 知识库，以提高特定领域技能识别的准确性
    setupWeb3KnowledgeBase();
    
    // 报告进度 - 运行工作流
    progressCallback(40, '正在分析简历结构和内容...');
    
    // 运行工作流
    const workflowInput: WorkflowInput = {
      fileContent,
      fileName: file.name,
      fileType
    };
    
    const result = await runWorkflow(apiAgent, workflowInput);
    
    // 更新进度
    for (let i = 50; i <= 100; i += 10) {
      progressCallback(i, `解析简历中 (${i}%)...`);
      // 为了展示进度效果，添加一个小延迟
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    progressCallback(100, '解析完成');
    
    return { data: result };
  } catch (error) {
    const errorMsg = `AI解析失败: ${error instanceof Error ? error.message : String(error)}`;
    console.error('简历AI解析错误:', error);
    
    // 发生错误时尝试退回到传统解析方法
    try {
      console.log('尝试使用传统解析方法作为备选方案...');
      const result = await parseResume(file);
      return result;
    } catch (fallbackError) {
      // 如果备选方案也失败，返回原始错误
      return { error: errorMsg };
    }
  }
}

/**
 * 从PDF文件中提取文本
 * @param file - PDF文件
 * @returns 提取的文本内容
 */
async function extractPdfText(file: File): Promise<string> {
  try {
    // 使用 pdf.js 提取文本
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    
    // 设置worker路径
    // @ts-ignore - pdf.js类型定义问题
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    const fileData = await file.arrayBuffer();
    const pdfDoc = await pdfjs.getDocument({ data: fileData }).promise;
    
    let textContent = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      
      // 按位置排序文本项
      const textItems = content.items
        .filter(item => 'str' in item)
        .map(item => {
          return {
            text: (item as any).str,
            x: (item as any).transform[4],
            y: (item as any).transform[5]
          };
        })
        .sort((a, b) => {
          // 先按y坐标排序（从上到下），然后按x坐标排序（从左到右）
          const yDiff = b.y - a.y;
          if (Math.abs(yDiff) > 5) return yDiff;
          return a.x - b.x;
        });
      
      // 合并文本，尝试保留布局
      let lastY = null;
      let lineText = '';
      
      for (const item of textItems) {
        if (lastY === null || Math.abs(lastY - item.y) > 5) {
          if (lineText) {
            textContent += lineText.trim() + '\n';
          }
          lineText = item.text;
        } else {
          // 在同一行上，添加适当的间距
          lineText += ' ' + item.text;
        }
        lastY = item.y;
      }
      
      if (lineText) {
        textContent += lineText.trim() + '\n';
      }
      
      // 添加页分隔符
      textContent += '\n';
    }
    
    // 后处理文本，移除多余空行和格式化结构
    return preprocessText(textContent);
  } catch (error) {
    console.error('PDF文本提取失败:', error);
    throw error;
  }
}

/**
 * 从DOCX文件中提取文本
 * @param file - DOCX文件
 * @returns 提取的文本内容
 */
async function extractDocxText(file: File): Promise<string> {
  try {
    const fileData = await file.arrayBuffer();
    const result = await mammoth.extractRawText({
      arrayBuffer: fileData
    });
    
    // 处理提取的文本
    const textContent = result.value;
    
    // 后处理文本，移除多余空行和格式化结构
    return preprocessText(textContent);
  } catch (error) {
    console.error('DOCX文本提取失败:', error);
    throw error;
  }
}

/**
 * 预处理提取的文本以改善格式和结构识别
 * @param text - 原始提取文本
 * @returns 处理后的文本
 */
function preprocessText(text: string): string {
  // 移除多余的空行
  let processedText = text.replace(/\n{3,}/g, '\n\n');
  
  // 格式化一些常见的简历部分标题
  const sectionTitles = [
    '个人信息', '联系方式', '工作经验', '工作经历', '项目经验', 
    '教育背景', '教育经历', '技能', '专业技能', '证书',
    'PERSONAL INFORMATION', 'CONTACT', 'WORK EXPERIENCE', 'EXPERIENCE',
    'PROJECTS', 'EDUCATION', 'SKILLS', 'CERTIFICATES'
  ];
  
  // 为部分标题添加一致的格式
  for (const title of sectionTitles) {
    const titleRegex = new RegExp(`(^|\\n)\\s*${title}\\s*:?\\s*($|\\n)`, 'gi');
    processedText = processedText.replace(titleRegex, `\n\n${title.toUpperCase()}:\n`);
  }
  
  // 格式化电子邮件地址
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  processedText = processedText.replace(emailRegex, '\nEmail: $1\n');
  
  // 格式化电话号码
  const phoneRegex = /(\+?[\d-]{10,15})/g;
  processedText = processedText.replace(phoneRegex, (match) => {
    // 只替换尚未格式化的电话号码
    const prefix = processedText.substring(processedText.lastIndexOf('\n', processedText.indexOf(match)), processedText.indexOf(match));
    if (!prefix.includes('电话') && !prefix.includes('Phone')) {
      return '\nPhone: ' + match + '\n';
    }
    return match;
  });
  
  // 格式化日期范围
  const dateRangeRegex = /(\d{4}[-/\.]\d{1,2})\s*[-–~至to]\s*(\d{4}[-/\.]\d{1,2}|present|现在|至今)/gi;
  processedText = processedText.replace(dateRangeRegex, '\nPeriod: $1 - $2\n');
  
  return processedText;
} 