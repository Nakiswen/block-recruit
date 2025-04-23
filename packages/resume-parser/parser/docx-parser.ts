import { ResumeData } from '../types';
import { parseTextResume } from './text-parser';

/**
 * 从DOCX文件解析简历信息
 * 使用mammoth库将DOCX转换为HTML并保留格式，然后提取文本内容
 * @param file DOCX简历文件
 * @returns 解析结果
 */
export async function parseDocxResume(file: File): Promise<{ data?: ResumeData; error?: string }> {
  try {
    const text = await extractTextFromDocx(file);
    // 使用文本解析器处理提取的文本
    return parseTextResume(text);
  } catch (error) {
    console.error('DOCX解析错误:', error);
    return { 
      error: 'DOCX解析失败: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * 从DOCX文件中提取文本内容
 * @param file DOCX文件
 * @returns 提取的文本内容
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  // 检查是否可以在浏览器环境中使用
  if (typeof window === 'undefined') {
    throw new Error('DOCX解析需要在浏览器环境中运行');
  }

  // 动态导入mammoth库
  const mammoth = await import('mammoth');
  
  // 将文件转换为ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // 设置转换选项，保留更多格式和结构信息
  const options = {
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Title'] => h1:fresh",
      "p[style-name='Subtitle'] => h2:fresh",
      "p[style-name='heading 1'] => h1:fresh",
      "p[style-name='heading 2'] => h2:fresh",
      "p[style-name='heading 3'] => h3:fresh",
      "p[style-name='heading 4'] => h4:fresh",
      "r[style-name='Strong'] => strong",
      "r[style-name='Emphasis'] => em",
      "p[style-name='List Paragraph'] => ul > li:fresh",
      "b => b"
    ],
    includeDefaultStyleMap: true,
    ignoreEmptyParagraphs: true,
    preserveEmptyParagraphs: false
  };
  
  // 将DOCX转换为HTML，保留更多结构信息
  const result = await mammoth.convertToHtml({ arrayBuffer }, options);
  const html = result.value;
  
  // 提取HTML中的文本内容
  const text = extractTextFromHtml(html);
  
  // 记录任何转换过程中的警告
  if (result.messages.length > 0) {
    console.warn('DOCX转换警告:', result.messages);
  }
  
  // 预处理文本内容
  return preprocessDocxText(text);
}

/**
 * 从HTML中提取格式化的文本
 * @param html HTML内容
 * @returns 提取的文本内容
 */
function extractTextFromHtml(html: string): string {
  // 在浏览器环境中创建DOM解析器
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  let textContent = '';
  
  // 处理各类标题元素
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const text = heading.textContent?.trim();
    if (text) {
      // 为标题添加额外的换行符以突出显示
      textContent += `\n${text}\n\n`;
      heading.remove(); // 从DOM中移除已处理的元素
    }
  });
  
  // 处理段落和列表
  const paragraphs = doc.querySelectorAll('p, li');
  paragraphs.forEach(paragraph => {
    const text = paragraph.textContent?.trim();
    if (text) {
      textContent += `${text}\n`;
    }
  });
  
  // 处理表格
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      const rowText = Array.from(cells)
        .map(cell => cell.textContent?.trim())
        .filter(Boolean)
        .join(' | ');
      
      if (rowText) {
        textContent += `${rowText}\n`;
      }
    });
    textContent += '\n';
  });
  
  // 如果上述方法没有提取到足够的内容，退回到使用完整的文本内容
  if (textContent.trim().length === 0) {
    textContent = doc.body.textContent || '';
  }
  
  return textContent;
}

/**
 * 预处理从DOCX提取的文本，以改善格式和结构识别
 */
function preprocessDocxText(text: string): string {
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