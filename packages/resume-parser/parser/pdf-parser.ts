import { ResumeData } from '../types';
import { parseTextResume } from './text-parser';

/**
 * 从PDF文件解析简历信息
 * 使用pdf.js库提取文本内容，然后利用文本解析器处理
 * @param file PDF简历文件
 * @returns 解析结果
 */
export async function parsePdfResume(file: File): Promise<{ data?: ResumeData; error?: string }> {
  try {
    const text = await extractTextFromPdf(file);
    // 利用文本解析器处理提取的文本
    return parseTextResume(text);
  } catch (error) {
    console.error('PDF解析错误:', error);
    return { 
      error: 'PDF解析失败: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * 从PDF文件中提取文本内容
 * @param file PDF文件或二进制数据
 * @returns 提取的文本内容
 */
export async function extractTextFromPdf(file: File | Uint8Array): Promise<string> {
  // 检查是否可以在浏览器环境中使用
  if (typeof window === 'undefined') {
    throw new Error('PDF解析需要在浏览器环境中运行');
  }

  // 动态导入pdf.js库
  const pdfjs = await import('pdfjs-dist/build/pdf');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
  
  // 设置worker
  if (typeof window !== 'undefined') {
    (pdfjs as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }

  // 准备数据
  let pdfData;
  if (file instanceof File) {
    // 将文件转换为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    pdfData = new Uint8Array(arrayBuffer);
  } else {
    // 直接使用二进制数据
    pdfData = file;
  }
  
  // 加载PDF文档
  const loadingTask = (pdfjs as any).getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  
  // 获取页数
  const numPages = pdf.numPages;
  let fullText = '';
  
  // 从每页提取文本，保留布局信息
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // 按照位置对文本项进行排序
    const textItems = textContent.items
      .filter((item: any) => item.str.trim().length > 0)
      .sort((a: any, b: any) => {
        // 首先按Y坐标排序（从上到下）
        if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
          return b.transform[5] - a.transform[5]; // PDF坐标系从下往上
        }
        // 然后按X坐标排序（从左到右）
        return a.transform[4] - b.transform[4];
      });
    
    // 识别文本块
    let lastY = -1;
    let lineText = '';
    
    for (const item of textItems) {
      const y = Math.round(item.transform[5]);
      
      // 如果Y坐标变化超过阈值，认为是新的一行
      if (lastY !== -1 && Math.abs(y - lastY) > 3) {
        fullText += lineText.trim() + '\n';
        lineText = '';
      }
      
      // 如果X坐标相差太大，添加额外空格以保持布局
      if (lineText.length > 0) {
        lineText += ' ';
      }
      
      lineText += item.str;
      lastY = y;
    }
    
    // 添加最后一行
    if (lineText.trim().length > 0) {
      fullText += lineText.trim() + '\n';
    }
    
    // 页面之间添加分隔符
    fullText += '\n';
  }
  
  // 预处理文本以改善格式
  return preprocessPdfText(fullText);
}

/**
 * 预处理从PDF提取的文本，以改善格式和结构识别
 */
function preprocessPdfText(text: string): string {
  // 去除多余的空行
  let processedText = text.replace(/\n{3,}/g, '\n\n');
  
  // 尝试识别标题并添加格式
  const sectionTitles = [
    '个人信息', '联系方式', '工作经验', '工作经历', '教育背景', '教育经历', 
    '专业技能', '技能', '项目经验', '项目经历', '证书', '语言',
    'PERSONAL INFORMATION', 'CONTACT', 'EXPERIENCE', 'WORK EXPERIENCE',
    'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'LANGUAGES'
  ];
  
  // 为标题添加格式
  sectionTitles.forEach(title => {
    const titleRegex = new RegExp(`(^|\\n)(${title})(\\s*:?\\s*)(\\n|$)`, 'gi');
    processedText = processedText.replace(titleRegex, '$1\n$2：\n$4');
  });
  
  // 识别简历中常见的关键信息并格式化
  
  // 识别可能的电子邮件地址
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  processedText = processedText.replace(emailRegex, match => `\n电子邮件：${match}\n`);
  
  // 识别可能的电话号码
  const phoneRegex = /\b(?:\+?86)?1[3-9]\d{9}\b|\b(?:\+?1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  processedText = processedText.replace(phoneRegex, match => `\n电话：${match}\n`);
  
  // 识别可能的日期范围（如工作经历）
  const dateRangeRegex = /(\d{4}[\/.]\d{1,2})\s*[-–—至到to]\s*(\d{4}[\/.]\d{1,2}|\s*现在|\s*至今|\s*Present)/gi;
  processedText = processedText.replace(dateRangeRegex, '\n$&\n');
  
  return processedText;
} 