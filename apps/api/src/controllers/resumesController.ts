import type { Context, Next } from 'koa';
import type { File } from '@koa/multer';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import * as resumesService from '@/services/resumesService';
import { BusinessError } from '@/services/resumesService';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

/**
 * 从不同类型的文件中提取纯文本内容。
 * @param file - 从Multer中间件获取的文件对象。
 * @returns 返回一个包含提取出的文本的Promise。
 * @throws 如果文件类型不受支持或解析失败，则抛出错误。
 */
async function extractTextFromFile(file: File): Promise<string> {
  console.log("🚀 ~ extractTextFromFile ~ file:", file)
  switch (file.mimetype) {
    case 'application/pdf': {
      try {
        // 尝试使用动态导入方式
        try {
          const pdfjs = await import('pdfjs-dist');
          
          // 创建文档加载任务
          const loadingTask = pdfjs.getDocument({ data: file.buffer });
          const pdfDoc = await loadingTask.promise;
          let text = '';
          
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
              .map((item: any) => 'str' in item ? item.str : '')
              .join(' ');
            text += pageText + '\n';
          }
          
          return text;
        } catch (pdfError) {
          console.error('PDF库解析失败，尝试使用备用方法:', pdfError);
          
          // 备用方法：将PDF内容保存为临时文件，然后直接读取内容
          // 注意：这种方法只能提取简单的文本内容
          const tempDir = path.join(process.cwd(), 'temp');
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          
          const tempPdfPath = path.join(tempDir, `temp_${Date.now()}.pdf`);
          const tempTxtPath = path.join(tempDir, `temp_${Date.now()}.txt`);
          
          try {
            // 写入临时PDF文件
            fs.writeFileSync(tempPdfPath, file.buffer);
            
            // 尝试使用系统工具提取文本（如果有安装的话）
            try {
              await execPromise(`pdftotext "${tempPdfPath}" "${tempTxtPath}"`);
              const extractedText = fs.readFileSync(tempTxtPath, 'utf8');
              return extractedText || '无法提取PDF文本内容';
            } catch (cmdError) {
              console.error('无法使用pdftotext工具:', cmdError);
              // 如果系统工具也失败，返回一个基本的错误信息
              return '无法解析PDF内容，请上传文本格式的简历或联系管理员';
            }
          } finally {
            // 清理临时文件
            try {
              if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
              if (fs.existsSync(tempTxtPath)) fs.unlinkSync(tempTxtPath);
            } catch (cleanupError) {
              console.error('清理临时文件失败:', cleanupError);
            }
          }
        }
      } catch (error) {
        console.error('PDF解析错误:', error);
        throw new Error(`PDF解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const { value } = await mammoth.extractRawText({ buffer: file.buffer });
      return value;
    }
    case 'image/png':
    case 'image/jpeg': {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(file.buffer);
      await worker.terminate();
      return text;
    }
    case 'text/markdown':
    case 'text/x-markdown': {
      // 直接读取Markdown文件内容
      return file.buffer.toString('utf8');
    }
    case 'text/plain': {
      // 直接读取纯文本文件内容
      return file.buffer.toString('utf8');
    }
    default:
      // 对于不支持的文件类型，抛出带有明确信息的错误。
      throw new Error(`不支持的文件类型: ${file.mimetype}`);
  }
}

/**
 * 控制器：处理简历上传 - 异步处理版
 * 快速响应用户请求，后台异步处理
 * @param ctx Koa上下文
 */
export async function uploadResumeAsync(ctx: Context) {
  const { file } = ctx;
  if (!file) {
    ctx.status = 400;
    ctx.body = { error: '未找到上传的简历文件' };
    return;
  }

  // 从认证中间件中获取用户ID
  const userId = ctx.state.user?.userId;
  if (!userId) {
    ctx.status = 401;
    ctx.body = { error: '用户未授权' };
    return;
  }

  try {
    // 从上传文件中提取文本
    const content = await extractTextFromFile(file);
    if (!content.trim()) {
      ctx.status = 400;
      ctx.body = { error: '无法从文件中提取有效文本内容' };
      return;
    }

    // 仅保存简历，获取ID，启动异步处理
    const resumeId = await resumesService.createResumeAndProcessAsync(
      userId, 
      content, 
      file.originalname,
      file.mimetype,
      file.size
    );

    // 快速响应用户
    ctx.status = 202; // 已接受
    ctx.body = {
      message: '简历上传成功，正在后台处理',
      resumeId: resumeId,
      status: 'processing'
    };
  } catch (error) {
    console.error('简历上传失败:', error);
    ctx.status = 500;
    ctx.body = { 
      error: '简历上传失败',
      message: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 控制器：处理简历上传并等待处理完成 - 同步版
 * 警告: 此方法会阻塞API调用，可能造成较长响应时间
 * @param ctx Koa上下文
 * @param next Koa next函数
 */
export async function uploadResume(ctx: Context, next: Next) {
  const { file } = ctx;
  if (!file) {
    ctx.status = 400;
    ctx.body = { error: '未找到上传的简历文件' };
    return;
  }

  // 从认证中间件中获取用户ID
  const userId = ctx.state.user?.userId;
  if (!userId) {
    ctx.status = 401;
    ctx.body = { error: '用户未授权' };
    return;
  }

  try {
    // 步骤 1: 从上传文件中提取文本
    const content = await extractTextFromFile(file);
    console.log("🚀 ~ uploadResume ~ content:", content);
    if (!content.trim()) {
      ctx.status = 400;
      ctx.body = { error: '无法从文件中提取有效文本内容' };
      return;
    }

    // 步骤 2: 调用服务层处理业务逻辑 (包含解析、向量化和匹配)
    const result = await resumesService.createResumeAndMatchJobs(
      userId, 
      content, 
      file.originalname,
      file.mimetype,
      file.size
    );

    // 步骤 3: 确定处理状态并返回适当的响应
    ctx.status = 200; // 已创建
    
    // 构建响应体
    const response = {
      message: '简历上传成功',
      resumeId: result.resumeId,
      status: '',
      results: [],
    };
    
    // 根据处理结果添加状态信息
    if (result.matches && result.matches.length > 0) {
      response.results = result.matches;
      response.status = 'matched';
      response.statusDescription = '简历已完成解析、向量化和岗位匹配';
    } else if (result.vectorizeResult) {
      response.status = 'vectorized';
      response.statusDescription = '简历已完成解析和向量化，但未找到匹配岗位';
    } else if (result.parseResult) {
      response.status = 'parsed';
      response.statusDescription = '简历已完成解析，但向量化过程未完成';
    } else {
      response.status = 'created';
      response.statusDescription = '简历已保存，但解析过程未完成';
    }
    
    console.log("🚀 ~ uploadResume ~ response:", response)
    ctx.body = response;
    await next();
  } catch (error) {
    console.error('简历上传处理失败:', error);
    
    // 根据错误类型返回不同的状态码
    if (error instanceof BusinessError) {
      switch (error.code) {
        case 'RESUME_NOT_FOUND':
          ctx.status = 404;
          break;
        case 'RESUME_NOT_PARSED':
        case 'PARSE_FAILED':
        case 'VECTORIZE_FAILED':
          ctx.status = 422; // Unprocessable Entity
          break;
        case 'VECTORDB_NOT_INITIALIZED':
          ctx.status = 503; // Service Unavailable
          break;
        default:
          ctx.status = 400;
      }
      
      ctx.body = {
        error: error.message,
        code: error.code
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: '简历处理失败',
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
}

/**
 * 控制器：手动触发简历处理
 * @param ctx Koa上下文
 */
export async function processResume(ctx: Context) {
  const { resumeId } = ctx.params;
  
  if (!resumeId) {
    ctx.throw(400, '必须提供简历ID');
  }

  try {
    // 步骤 1: 解析结构化数据
    await resumesService.parseResume(resumeId);
    
    // 步骤 2: 向量化存储
    await resumesService.vectorizeResume(resumeId);
    
    // 返回成功响应
    ctx.status = 200;
    ctx.body = {
      message: '简历处理成功',
      resumeId: resumeId,
      status: 'vectorized'
    };
  } catch (error) {
    console.error(`处理简历 ${resumeId} 失败:`, error);
    ctx.throw(500, '简历处理失败', { originalError: error });
  }
}

/**
 * 控制器：对指定的简历和岗位进行匹配分析
 * @param ctx - Koa的上下文对象
 * @param next - Koa的next函数
 */
export async function matchResumeToJob(ctx: Context, next: Next) {
  const { resumeId, jobId } = ctx.request.body as { resumeId?: string; jobId?: string };

  if (!resumeId || !jobId) {
    ctx.throw(400, '请求体中必须包含 resumeId 和 jobId');
  }

  try {
    const result = await resumesService.getEnhancedMatchForPair(resumeId, jobId);
    ctx.status = 200;
    ctx.body = result;
    await next();
  } catch (error: unknown) {
    console.error(`为简历 ${resumeId} 和岗位 ${jobId} 匹配失败:`, error);
    if (error instanceof Error && error.message.includes('不存在')) {
      ctx.throw(404, error.message);
    }
    ctx.throw(500, '匹配分析失败', { originalError: error });
  }
}

/**
 * 控制器：获取指定简历的匹配岗位列表
 * @param ctx - Koa的上下文对象
 * @param next - Koa的next函数
 */
export async function getMatchingJobsForResume(ctx: Context, next: Next) {
  const { resumeId } = ctx.params;
  const filters = ctx.query;

  if (!resumeId) {
    ctx.throw(400, '必须提供简历ID');
  }
  
  try {
    const matches = await resumesService.getMatchedJobsForResume(resumeId, filters);
    ctx.status = 200;
    ctx.body = matches;
    await next();
  } catch (error: unknown) {
    console.error(`为简历 ${resumeId} 获取匹配岗位失败:`, error);
    if (error instanceof Error && error.message.includes('不存在')) {
      ctx.throw(404, error.message);
    }
    ctx.throw(500, '获取匹配岗位列表失败', { originalError: error });
  }
}
