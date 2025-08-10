import { ragService } from '../services/rag/ragService';
import { jobsPrisma } from '../prisma/client';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();
/**
 * 测试RAG服务 - 将PostgreSQL中的岗位数据转换为Pinecone向量
 */
async function testRagService() {
  try {
    console.log('开始初始化RAG服务...');
    await ragService.init();
    console.log('RAG服务初始化成功');
    
    // 先检查总数据量
    console.log('检查数据库中岗位总数...');
    const totalCount = await jobsPrisma.job_posting.count();
    console.log(`数据库中共有 ${totalCount} 条岗位记录`);
    
    // 获取岗位数据 (限制1000条用于测试)
    console.log('从PostgreSQL获取岗位数据...');
    const jobs = await jobsPrisma.job_posting.findMany({
      take: 2000,
      orderBy: {
        topic_id: 'desc'
      }
    });
    // console.log("🚀 ~ testRagService ~ jobs:", jobs);
    
    if (!jobs || jobs.length === 0) {
      console.log('没有找到岗位数据');
      return;
    }
    
    console.log(`获取到 ${jobs.length} 条岗位数据`);

    console.log('jobs 0：', jobs[0].toString());
    
    // 提取岗位ID
    const jobIds = jobs.map(job => job.topic_id.toString());
    console.log('岗位ID列表:', jobIds);


    // const testJobId = jobIds[0];
    // console.log(`\n测试检索岗位向量 (ID: ${testJobId})...`);
    
    // const jobVector = await ragService.getJobVector(testJobId);
    // if (jobVector) {
    //   console.log('成功检索到岗位向量:');
    //   console.log(`- ID: ${jobVector.id}`);
    //   console.log(`- 向量维度: ${jobVector.vector.length}`);
    //   console.log('- 元数据:', JSON.stringify(jobVector.metadata, null, 2));
    //   console.log('\nRAG服务测试完成......QAQ');
    //   return;
    // } else {
    //   console.log('未找到岗位向量');
    // }

    
    // 处理岗位数据，生成向量
    console.log('开始处理岗位数据，生成向量...');
    const result = await ragService.processJobs(jobIds);
    
    console.log('处理结果统计:');
    console.log(`- 总数: ${result.total}`);
    console.log(`- 成功: ${result.success}`);
    console.log(`- 失败: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('错误信息:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // 如果有成功处理的岗位，尝试检索一个
    if (result.success > 0) {
      const testJobId = jobIds[0];
      console.log(`\n测试检索岗位向量 (ID: ${testJobId})...`);
      
      const jobVector = await ragService.getJobVector(testJobId);
      if (jobVector) {
        console.log('成功检索到岗位向量:');
        console.log(`- ID: ${jobVector.id}`);
        console.log(`- 向量维度: ${jobVector.vector.length}`);
        console.log('- 元数据:', JSON.stringify(jobVector.metadata, null, 2));
      } else {
        console.log('未找到岗位向量');
      }
    }
    
    console.log('\nRAG服务测试完成');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  } finally {
    // 关闭Prisma连接
    await jobsPrisma.$disconnect();
    process.exit(0);
  }
}

// 执行测试
testRagService(); 