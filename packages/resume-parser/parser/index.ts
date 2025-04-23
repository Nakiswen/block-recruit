import { ResumeData } from '../types';
import { parseTextResume } from './text-parser';
import { parsePdfResume } from './pdf-parser';
import { parseDocxResume } from './docx-parser';

/**
 * 解析简历文件，支持PDF、DOCX和纯文本格式
 * @param file 简历文件
 * @returns 解析后的简历数据
 */
export async function parseResume(file: File): Promise<{ data?: ResumeData; error?: string }> {
  try {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // 根据文件类型选择解析器
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePdfResume(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await parseDocxResume(file);
    } else if (
      fileType === 'text/plain' ||
      fileName.endsWith('.txt')
    ) {
      const text = await file.text();
      return parseTextResume(text);
    } else {
      return { error: `不支持的文件类型: ${fileType}` };
    }
  } catch (error) {
    console.error('简历解析错误:', error);
    return { 
      error: '简历解析失败: ' + (error instanceof Error ? error.message : String(error))
    };
  }
} 