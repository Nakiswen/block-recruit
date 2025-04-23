import { NextRequest, NextResponse } from 'next/server';
import { parseResume, aiParserFunction, setupWeb3KnowledgeBase } from 'resume-parser';

/**
 * 处理简历AI解析请求
 */
export async function POST(request: NextRequest) {
  try {
    // 从请求中获取文件和进度报告回调
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '请上传简历文件' },
        { status: 400 }
      );
    }
    
    // 验证文件类型
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !['pdf', 'docx', 'doc', 'txt'].includes(fileType)) {
      return NextResponse.json(
        { error: `不支持的文件格式: ${fileType}。请上传PDF或DOCX文件。` },
        { status: 400 }
      );
    }
    
    // 初始化Web3知识库，提高特定领域技能识别的准确性
    setupWeb3KnowledgeBase();
    
    // 使用AI解析方法
    const parseResult = await aiParserFunction(file);
    
    if (parseResult.error) {
      console.warn('AI解析失败，尝试使用传统解析方法:', parseResult.error);
      
      // 使用传统解析方法作为备选
      const fallbackResult = await parseResume(file);
      
      if (fallbackResult.error) {
        return NextResponse.json(
          { error: fallbackResult.error },
          { status: 500 }
        );
      }
      
      if (!fallbackResult.data) {
        return NextResponse.json(
          { error: '从文件中提取的文本内容为空' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ data: fallbackResult.data });
    }
    
    // 返回AI解析结果
    return NextResponse.json({ data: parseResult.data });
    
  } catch (error) {
    console.error('简历AI解析错误:', error);
    return NextResponse.json(
      { error: `AI解析失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 