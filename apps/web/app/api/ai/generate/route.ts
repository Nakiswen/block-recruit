import { NextResponse } from 'next/server';
import { AgentWrapper } from 'resume-parser/ai-agent/agent-wrapper';

// 环境变量获取API密钥
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    // 检查API密钥是否存在
    console.log("🚀 ~ POST ~ API_KEY是否存在:", !!API_KEY);

    if (!API_KEY) {
      return NextResponse.json(
        { error: '服务器未配置API密钥' },
        { status: 500 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { prompt } = body;

    // 验证请求参数
    console.log("🚀 ~ POST ~ prompt:", prompt);
    if (!prompt) {
      return NextResponse.json(
        { error: '缺少必要的prompt参数' },
        { status: 400 }
      );
    }

    // 创建Mastra代理实例并处理请求
    const mastraAgent = new AgentWrapper();
    const text = await mastraAgent.process(prompt);

    // 返回结果
    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI生成文本失败:', error);
    return NextResponse.json(
      { error: `生成文本时出错: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 