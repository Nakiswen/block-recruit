import { ragService } from '../rag/ragService';
import { resumePrisma, jobsPrisma } from '../prisma/client';
import * as dotenv from 'dotenv';
import { Resume } from '@/prisma/web3cv';

// 加载环境变量
dotenv.config();

/**
 * 测试RAG服务 - 将PostgreSQL中的简历数据转换为Pinecone向量，并进行岗位匹配
 */
async function testResumeRagService() {
  try {
    console.log('开始初始化RAG服务...');
    await ragService.init();
    console.log('RAG服务初始化成功');
    
    // 获取简历数据 (限制1条用于测试)
    console.log('从PostgreSQL获取简历数据...');
    const resume = await resumePrisma.resume.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log("🚀 ~ testResumeRagService ~ resume:", resume)
    
    if (!resume) {
      console.log('没有找到简历数据');
      return;
    }
    
    console.log(`获取到简历数据，ID: ${resume.id}`);
    
    // 处理简历，生成向量
    console.log('\n开始处理简历数据，生成向量...');
    try {
      await ragService.vectorizeAndStoreResume(resume as Resume);
      console.log('向量生成成功');
    } catch (error) {
      console.error('向量生成失败:', error);
      return;
    }
    
    // 获取简历向量
    console.log('\n获取简历向量...');
    const resumeVector = await ragService.getResumeVector(resume.id);
    
    if (!resumeVector) {
      console.log('未找到简历向量');
      return;
    }
    
    console.log('成功获取简历向量:');
    console.log(`- ID: ${resumeVector.id}`);
    console.log(`- 向量维度: ${resumeVector.vector.length}`);
    console.log('- 元数据:', JSON.stringify(resumeVector.metadata, null, 2));
    
    // 使用向量搜索匹配岗位
    console.log('\n使用简历向量搜索匹配岗位...');
    try {
      const searchOptions = {
        topK: 5,
        minScore: 0.5
      };
      
      const searchResults = await ragService.findSimilarJobs(resumeVector.vector, searchOptions);
      
      if (searchResults.matches.length === 0) {
        console.log('没有找到匹配的岗位');
      } else {
        console.log(`找到 ${searchResults.matches.length} 个匹配的岗位:`);
        
        // 显示向量搜索结果
        for (const match of searchResults.matches) {
          console.log(`\n- 岗位ID: ${match.id}`);
          console.log(`  相似度分数: ${match.score.toFixed(4)}`);
          
          // 获取岗位详情
          try {
            const job = await jobsPrisma.job_posting.findUnique({
              where: { topic_id: BigInt(match.id) }
            });
            
            if (job) {
              console.log(`  岗位名称: ${job.position_name}`);
              console.log(`  公司: ${job.company || '未知'}`);
            }
          } catch (err) {
            console.error(`获取岗位详情失败:`, err);
          }
        }
        
        // 使用AI增强匹配
        console.log('\n开始进行AI增强匹配分析...');
        try {
          const enhancedMatches = await ragService.findMatchingJobs(resume.id, 3, {});
          
          if (enhancedMatches.length > 0) {
            console.log(`\nAI增强匹配结果 (Top ${enhancedMatches.length}):`);
            enhancedMatches.forEach((match, index) => {
              console.log(`\n[${index + 1}] 岗位: ${match.job.title || '未知岗位'}`);
              console.log(`  匹配分数: ${match.matchDetails.score.toFixed(2)}`);
              console.log(`  匹配技能: ${match.matchDetails.matchedSkills.join(', ')}`);
              console.log(`  欠缺技能: ${match.matchDetails.missingSkills.join(', ')}`);
              console.log(`  匹配原因: ${match.matchDetails.matchReasons.join('; ')}`);
              console.log(`  改进建议: ${match.matchDetails.improvementSuggestions.join('; ')}`);
            });
          } else {
            console.log('AI增强匹配分析未返回结果');
          }
        } catch (error) {
          console.error('AI增强匹配分析失败:', error);
        }
      }
    } catch (error) {
      console.error('向量搜索失败:', error);
    }
    
    console.log('\nRAG服务测试完成');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  } finally {
    // 关闭Prisma连接
    await resumePrisma.$disconnect();
    await jobsPrisma.$disconnect();
    process.exit(0);
  }
}

// 执行测试
testResumeRagService(); 