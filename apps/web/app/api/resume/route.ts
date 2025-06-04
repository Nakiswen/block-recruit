import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/apps/web/lib/prisma';
import { analyzeResume, generateResumeVectors, calculateMatchingScore } from '@/apps/web/lib/llm';

// 检查钱包认证
function checkWalletAuth(req: Request) {
  const authHeader = req.headers.get('authorization')
  
  // 如果没有授权头，返回未授权
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  // 在实际应用中应验证wallet签名或token
  // 这里简单地检查存在性作为示例
  return true
}

/**
 * 处理简历AI解析请求
 */
export async function POST(req: Request) {
  try {
    // 检查用户是否已连接钱包
    if (!checkWalletAuth(req)) {
      return NextResponse.json(
        { success: false, error: '请先连接钱包' },
        { status: 401 }
      )
    }
    
    const { jobId, resumeContent } = await req.json();
    
    // 查询岗位信息
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: '岗位不存在' },
        { status: 404 }
      );
    }
    
    // 1. 解析简历内容 - 传递请求头用于API密钥
    const parsedResume = await analyzeResume(resumeContent);
    
    // 2. 生成简历向量 - 创建一个唯一ID并传递
    const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const resumeVectors = await generateResumeVectors(resumeContent, resumeId);
    
    // 3. 计算匹配度和评分 - 传递请求头用于API密钥
    const {
      totalScore,
      skillScore,
      experienceScore,
      matchingPoints,
      suggestions
    } = await calculateMatchingScore(resumeVectors, job, req.headers);
    
    // 4. 保存分析结果
    const analysis = await prisma.resumeAnalysis.create({
      data: {
        jobId,
        resumeContent,
        parsedResume: JSON.stringify(parsedResume), // 将复杂对象转换为JSON字符串存储
        totalScore,
        skillScore,
        experienceScore,
        matchingPoints: JSON.stringify(matchingPoints), // 将复杂对象转换为JSON字符串存储
        suggestions,
        recommended: totalScore >= 7 // 根据评分决定是否推荐
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        analysis,
        job
      }
    });
  } catch (error) {
    console.error('简历解析失败:', error);
    return NextResponse.json(
      { success: false, error: '简历解析失败：' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// 获取单个简历分析
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    // 是否查询单个分析结果
    if (id && id !== 'resume') {
      const analysis = await prisma.resumeAnalysis.findUnique({
        where: { id },
        include: { job: true }
      });
      
      if (!analysis) {
        return NextResponse.json(
          { success: false, error: '未找到分析结果' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: analysis });
    }
    
    // 获取分析历史
    const { searchParams } = url;
    const jobId = searchParams.get('jobId');
    
    const analyses = await prisma.resumeAnalysis.findMany({
      where: {
        jobId: jobId ? jobId : undefined
      },
      include: {
        job: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ success: true, data: analyses });
  } catch (error) {
    console.error('获取分析结果失败:', error);
    return NextResponse.json(
      { success: false, error: '获取分析结果失败' },
      { status: 500 }
    );
  }
}

// 删除简历分析
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少分析ID' },
        { status: 400 }
      );
    }
    
    await prisma.resumeAnalysis.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除分析结果失败:', error);
    return NextResponse.json(
      { success: false, error: '删除分析结果失败' },
      { status: 500 }
    );
  }
}

/**
 * 验证文件类型
 */
function validateFileType(file: File) {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  if (!fileType || !['pdf', 'docx', 'doc', 'txt'].includes(fileType)) {
    throw new Error(`不支持的文件格式: ${fileType}. 请上传PDF或DOCX文件。`);
  }
}