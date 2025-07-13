import type { Context, Next } from 'koa';
import type { File } from '@koa/multer';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import * as resumesService from '@/services/resumesService';
import * as resumesModel from '@/models/resumesModel';
import { BusinessError } from '@/services/resumesService';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { setResumeIdMapping, getRealResumeId } from '@/utils/resumeIdMap';

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
 * 控制器：处理简历上传 - 完全异步处理版
 * 立即返回临时ID，所有处理都在后台进行
 * @param ctx Koa上下文
 */
export async function uploadResume(ctx: Context) {
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

  // 生成临时ID
  const tempResumeId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 立即响应，不等待任何处理
  ctx.status = 202; // 已接受
  ctx.body = {
    message: '简历上传成功，正在后台处理',
    resumeId: tempResumeId,
    status: 'processing'
  };

  // 启动完全异步的处理流程
  processResumeCompletelyAsync(tempResumeId, userId, file).catch(error => {
    console.error(`异步处理简历 ${tempResumeId} 失败:`, error);
  });
}

/**
 * 完全异步处理简历的完整流程
 * @param tempResumeId 临时简历ID
 * @param userId 用户ID
 * @param file 上传的文件
 */
async function processResumeCompletelyAsync(
  tempResumeId: string,
  userId: string,
  file: File
): Promise<void> {
  try {
    console.log(`🔄 开始完全异步处理简历 ${tempResumeId}`);

    // 步骤1: 异步提取文本内容
    const content = await extractTextFromFile(file);
    if (!content.trim()) {
      console.error(`❌ 简历 ${tempResumeId} 无法提取有效文本内容`);
      return;
    }
    console.log(`✅ 简历 ${tempResumeId} 文本提取完成`);

    // 步骤2: 异步保存到数据库
    const resumeId = await resumesService.uploadResume(
      userId, 
      content, 
      file.originalname,
      file.mimetype,
      file.size
    );
    // 保存临时ID和真实ID的映射
    await setResumeIdMapping(tempResumeId, resumeId);
    console.log(`✅ 简历 ${tempResumeId} 已保存到数据库，真实ID: ${resumeId}`);

    // 幂等性判断，只有created状态才继续
    const resume = await resumesModel.getResumeById(resumeId);
    if (!resume) {
      console.error(`❌ 简历 ${resumeId} 不存在，无法继续处理`);
      return;
    }

    // 如果已经处理完成，直接返回
    if (resume.status === 'matched') {
      console.log(`⏭️ 简历 ${resumeId} 已经处理完成(状态为matched)，无需重复处理`);
      return;
    }
    
    // 如果状态不是created，但也不是matched，可能是处理中断，尝试继续处理
    if (resume.status !== 'created') {
      console.log(`⚠️ 简历 ${resumeId} 状态为 ${resume.status}，可能处理中断，尝试继续处理`);
    }

    // 步骤3: 异步解析简历
    let parseSuccess = false;
    try {
      if (resume.status === 'created' || resume.status === 'parse_failed') {
        await resumesService.parseResume(resumeId);
        console.log(`✅ 简历 ${resumeId} 解析完成`);
        parseSuccess = true;
      } else {
        console.log(`⏭️ 简历 ${resumeId} 已经解析过，跳过解析步骤`);
        parseSuccess = true;
      }
    } catch (parseError) {
      console.error(`❌ 简历 ${resumeId} 解析失败:`, parseError);
      // 继续执行后续步骤，不中断流程
    }

    // 步骤4: 异步向量化简历
    let vectorizeSuccess = false;
    try {
      if (parseSuccess && (resume.status === 'created' || resume.status === 'parsed' || resume.status === 'vectorize_failed')) {
        await resumesService.vectorizeResume(resumeId);
        console.log(`✅ 简历 ${resumeId} 向量化完成`);
        vectorizeSuccess = true;
      } else if (resume.status === 'vectorized' || resume.status === 'matched') {
        console.log(`⏭️ 简历 ${resumeId} 已经向量化过，跳过向量化步骤`);
        vectorizeSuccess = true;
      } else if (!parseSuccess) {
        console.log(`⚠️ 简历 ${resumeId} 解析失败，跳过向量化步骤`);
      }
    } catch (vectorizeError) {
      console.error(`❌ 简历 ${resumeId} 向量化失败:`, vectorizeError);
      // 继续执行后续步骤，不中断流程
    }

    // 步骤5: 异步执行岗位匹配
    try {
      if (vectorizeSuccess || resume.status === 'vectorized') {
        const matches = await resumesService.getMatchedJobsForResume(resumeId);
        console.log(`✅ 简历 ${resumeId} 匹配完成，找到 ${matches.length} 个岗位`);

        // 更新状态为已匹配
        await resumesModel.updateResumeStatus(resumeId, 'matched');
        console.log(`✅ 简历 ${resumeId} 状态已更新为matched`);
      } else {
        console.log(`⚠️ 简历 ${resumeId} 向量化失败，跳过岗位匹配步骤`);
        // 即使向量化失败，也尝试更新状态为处理完成，避免前端一直等待
        await resumesModel.updateResumeStatus(resumeId, 'match_failed');
      }
    } catch (matchError) {
      console.error(`❌ 简历 ${resumeId} 岗位匹配失败:`, matchError);
      // 即使匹配失败也标记为处理完成
      await resumesModel.updateResumeStatus(resumeId, 'match_failed');
    }

    console.log(`🎉 简历 ${resumeId} 完全异步处理完成`);
    
    // 再次检查状态，确保状态已更新
    const finalResume = await resumesModel.getResumeById(resumeId);
    console.log(`📊 简历 ${resumeId} 最终状态: ${finalResume?.status}`);
  } catch (error) {
    console.error(`❌ 简历 ${tempResumeId} 完全异步处理失败:`, error);

    // 如果有真实resumeId，更新错误状态
    try {
      const realId = getRealResumeId(tempResumeId);
      if (realId) {
        await resumesModel.updateResumeStatus(realId, 'process_failed');
        console.log(`⚠️ 简历 ${realId} 状态已更新为process_failed`);
      }
    } catch (updateError) {
      console.error(`❌ 更新简历状态失败:`, updateError);
    }
  }
}

/**
 * 控制器：获取简历处理进度
 * @param ctx Koa上下文
 */
export async function getResumeProgress(ctx: Context) {
  const { resumeId } = ctx.params;
  
  if (!resumeId) {
    ctx.status = 400;
    ctx.body = { error: '必须提供简历ID' };
    return;
  }

  try {
    const progress = await resumesService.getResumeProgress(resumeId);
    ctx.status = 200;
    ctx.body = progress;
  } catch (error) {
    console.error(`获取简历 ${resumeId} 进度失败:`, error);
    if (error instanceof BusinessError && error.code === 'RESUME_NOT_FOUND') {
          ctx.status = 404;
      ctx.body = { error: '简历不存在' };
    } else {
      ctx.status = 500;
      ctx.body = { error: '获取进度失败' };
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
  } catch (error: unknown) {
    console.error(`为简历 ${resumeId} 获取匹配岗位失败:`, error);
    if (error instanceof Error && error.message.includes('不存在')) {
      ctx.throw(404, error.message);
    }
    ctx.throw(500, '获取匹配岗位列表失败', { originalError: error });
  }
}
