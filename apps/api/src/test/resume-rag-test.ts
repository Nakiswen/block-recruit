import { ragService } from '../rag/ragService';
import { resumePrisma } from '../prisma/client';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 测试RAG服务 - 将PostgreSQL中的简历数据转换为Pinecone向量
 */
async function testResumeRagService() {
  try {
    console.log('开始初始化RAG服务...');
    await ragService.init();
    console.log('RAG服务初始化成功');
    
    // 获取简历数据 (限制5条用于测试)
    console.log('从PostgreSQL获取简历数据...');
    const resumes = await resumePrisma.resume.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!resumes || resumes.length === 0) {
      console.log('没有找到简历数据');
      return;
    }
    
    console.log(`获取到 ${resumes.length} 条简历数据`);
    
    // 提取简历ID
    const resumeIds = resumes.map(resume => resume.id);
    console.log('简历ID列表:', resumeIds);
    
    // 处理每一份简历，生成向量
    console.log('开始处理简历数据，生成向量...');
    
    const results = {
      total: resumeIds.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    for (const resumeId of resumeIds) {
      try {
        console.log(`处理简历 ID: ${resumeId}`);
        await ragService.processResume(resumeId);
        results.success++;
      } catch (error) {
        results.failed++;
        const errorMessage = `简历ID ${resumeId}: ${(error as Error).message}`;
        results.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }
    
    console.log('处理结果统计:');
    console.log(`- 总数: ${results.total}`);
    console.log(`- 成功: ${results.success}`);
    console.log(`- 失败: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('错误信息:');
      results.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // 如果有成功处理的简历，尝试检索一个
    if (results.success > 0) {
      const testResumeId = resumeIds.find((_, index) => !results.errors.some(err => err.includes(resumeIds[index])));
      
      if (testResumeId) {
        console.log(`\n测试检索简历向量 (ID: ${testResumeId})...`);
        
        const resumeVector = await ragService.getResumeVector(testResumeId);
        if (resumeVector) {
          console.log('成功检索到简历向量:');
          console.log(`- ID: ${resumeVector.id}`);
          console.log(`- 向量维度: ${resumeVector.vector.length}`);
          console.log('- 元数据:', JSON.stringify(resumeVector.metadata, null, 2));
        } else {
          console.log('未找到简历向量');
        }
      }
    }
    
    console.log('\nRAG服务测试完成');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  } finally {
    // 关闭Prisma连接
    await resumePrisma.$disconnect();
    process.exit(0);
  }
}

// 执行测试
testResumeRagService(); 