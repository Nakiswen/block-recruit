import { NextResponse } from 'next/server'
import { prisma } from '@/apps/web/lib/prisma'
import { analyzejobDescription, generateJobVectors } from '@/apps/web/lib/llm'
import { storeJobVectors } from '@/apps/web/lib/llm/vector-store'
import { Prisma } from '@prisma/client'

/**
 * 检查钱包认证
 * @param req 请求对象
 * @returns 认证是否通过
 */
function checkWalletAuth(req: Request) {
  const authHeader = req.headers.get('authorization')
  
  // 如果没有授权头，返回未授权
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  // 在实际应用中应验证wallet签名或token
  // 这里简单地检查存在性作为示例
  // TODO: 实现完整的钱包签名验证
  return true
}

/**
 * 验证任务参数
 * @param data 提交的任务数据
 * @returns 验证结果，包含错误信息（如有）
 */
function validateJobData(data: any) {
  const errors: string[] = []
  
  // 检查必填字段
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('岗位标题不能为空')
  } else if (data.title.length > 200) {
    errors.push('岗位标题长度不能超过200个字符')
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('岗位描述不能为空')
  } else if (data.description.length > 10000) {
    errors.push('岗位描述长度不能超过10000个字符')
  }
  
  if (!data.jobType || typeof data.jobType !== 'string' || data.jobType.trim().length === 0) {
    errors.push('岗位类型不能为空')
  }
  
  // 检查权重格式
  if (!data.weights || typeof data.weights !== 'object') {
    errors.push('权重必须是对象格式')
  } else {
    const { skills, experience, web3 } = data.weights
    if (typeof skills !== 'number' || typeof experience !== 'number' || typeof web3 !== 'number') {
      errors.push('权重必须包含有效的数值')
    }
    
    if (skills < 0 || experience < 0 || web3 < 0) {
      errors.push('权重不能为负数')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 创建新岗位
 * @param req 请求对象
 * @returns 响应对象
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
    
    // 解析请求体
    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '无效的请求数据格式' },
        { status: 400 }
      )
    }
    
    const { title, description, jobType, weights } = body
    
    // 验证请求数据
    const validation = validateJobData(body)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      )
    }
    
    // 调用LLM服务解析JD，传递请求头
    let parsedJD
    try {
      parsedJD = await analyzejobDescription(description, req.headers)
      
      // 验证解析结果的格式
      if (!parsedJD || typeof parsedJD !== 'object') {
        throw new Error('JD解析失败: 返回了无效的格式')
      }
      
      // 确保所需字段存在，即使为空数组
      if (!Array.isArray(parsedJD.requiredSkills)) parsedJD.requiredSkills = []
      if (!Array.isArray(parsedJD.preferredSkills)) parsedJD.preferredSkills = []
      if (!Array.isArray(parsedJD.responsibilities)) parsedJD.responsibilities = []
      if (!Array.isArray(parsedJD.web3Requirements)) parsedJD.web3Requirements = []
      
    } catch (error) {
      console.error('JD解析失败:', error)
      return NextResponse.json(
        { success: false, error: '岗位描述解析失败，请检查描述内容或稍后重试' },
        { status: 500 }
      )
    }
    
    // 生成向量，传递请求头
    let vectors
    try {
      // 调用生成向量的函数，将请求头转换为字符串格式
      const headerString = JSON.stringify(Object.fromEntries(req.headers.entries()))
      vectors = await generateJobVectors(parsedJD, headerString)
      
      // 验证向量结果的完整性
      if (!vectors || !vectors.description || !vectors.requirements || !vectors.responsibilities) {
        throw new Error('向量生成失败: 返回了无效的格式')
      }
    } catch (error) {
      console.error('向量生成失败:', error)
      return NextResponse.json(
        { success: false, error: '向量生成失败，请稍后重试' },
        { status: 500 }
      )
    }
    
    // 使用事务确保数据一致性
    try {
      // 创建岗位记录和存储向量在一个事务中完成
      const job = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 创建岗位记录
        const newJob = await tx.job.create({
          data: {
            title,
            description,
            jobType,
            weights,
            parsedRequirements: parsedJD,
            // 向量的元数据保存在数据库
            vectorMetadata: {
              dimensions: {
                description: vectors.description.length,
                requirements: vectors.requirements.length,
                responsibilities: vectors.responsibilities.length
              }
            }
          }
        })
        
        // 将向量存储到Upstash
        try {
          await storeJobVectors(newJob.id, vectors)
        } catch (error) {
          // 如果向量存储失败，抛出错误会导致事务回滚
          throw new Error('向量存储失败：' + (error instanceof Error ? error.message : String(error)))
        }
        
        return newJob
      })
      
      return NextResponse.json({ success: true, data: job })
    } catch (error) {
      console.error('创建岗位数据库操作失败:', error)
      
      // 区分数据库错误类型
      const errorMsg = error instanceof Error ? error.message : String(error)
      const isPrismaError = errorMsg.includes('Prisma')
      
      return NextResponse.json(
        { 
          success: false, 
          error: isPrismaError ? '数据库操作失败，请稍后重试' : errorMsg
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('创建岗位失败:', error)
    return NextResponse.json(
      { success: false, error: '创建岗位失败：服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * 获取岗位列表
 * @returns 响应对象
 */
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('获取岗位列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取岗位列表失败：服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * 删除岗位
 * @param req 请求对象
 * @returns 响应对象
 */
export async function DELETE(req: Request) {
  try {
    // 检查用户是否已连接钱包
    if (!checkWalletAuth(req)) {
      return NextResponse.json(
        { success: false, error: '请先连接钱包' },
        { status: 401 }
      )
    }
    
    // 解析请求体
    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '无效的请求数据格式' },
        { status: 400 }
      )
    }
    
    const { id } = body
    
    // 验证ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少有效的岗位ID' },
        { status: 400 }
      )
    }
    
    // 检查岗位是否存在
    const existingJob = await prisma.job.findUnique({
      where: { id }
    })
    
    if (!existingJob) {
      return NextResponse.json(
        { success: false, error: '岗位不存在' },
        { status: 404 }
      )
    }
    
    // 使用事务执行数据删除
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 删除岗位记录（级联删除会处理相关分析记录）
      await tx.job.delete({
        where: { id }
      })
      
      // 这里可以添加删除Upstash中的向量数据
      // TODO: 实现向量数据删除功能
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除岗位失败:', error)
    
    // 区分错误类型
    const errorMsg = error instanceof Error ? error.message : String(error)
    const isPrismaError = errorMsg.includes('Prisma')
    const status = errorMsg.includes('不存在') ? 404 : 500
    
    return NextResponse.json(
      { 
        success: false, 
        error: isPrismaError ? '数据库操作失败，请稍后重试' : '删除岗位失败：服务器内部错误' 
      },
      { status }
    )
  }
} 