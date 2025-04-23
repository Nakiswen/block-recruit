import { NextResponse } from 'next/server';
import { AgentWrapper } from 'resume-parser/ai-agent/agent-wrapper';

// 环境变量获取API密钥
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    // 检查API密钥是否存在
    if (!API_KEY) {
      return NextResponse.json(
        { error: '服务器未配置API密钥' },
        { status: 500 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { prompts } = body;

    // 验证请求参数
    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: '缺少必要的prompts参数或格式不正确' },
        { status: 400 }
      );
    }

    console.log(`处理批量请求，共${prompts.length}个提示`);

    // 创建Mastra代理实例
    const mastraAgent = new AgentWrapper();
    
    // 处理每个提示并收集结果
    const results = [];
    
    for (const prompt of prompts) {
      try {
        // 使用Mastra处理提示
        const text = await mastraAgent.process(prompt);
        results.push(text);
      } catch (promptError) {
        console.error('处理单个提示时出错:', promptError);
        results.push(`处理错误: ${promptError instanceof Error ? promptError.message : String(promptError)}`);
      }
    }

    // 返回所有结果
    return NextResponse.json({ results });
  } catch (error) {
    console.error('批量AI生成文本失败:', error);
    return NextResponse.json(
      { error: `批量生成文本时出错: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 