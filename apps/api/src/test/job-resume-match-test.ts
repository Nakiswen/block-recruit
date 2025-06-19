import { ragService } from '../rag/ragService';
import { jobsPrisma, resumePrisma } from '../prisma/client';
import { embeddingService } from '../rag/embeddingService';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 测试岗位-简历匹配功能
 */
async function testJobResumeMatching() {
  try {
    console.log('开始初始化RAG服务...');
    await ragService.init();
    console.log('RAG服务初始化成功');
    
    // 1. 获取一个岗位用于测试
    console.log('获取测试岗位...');
    const job = await jobsPrisma.job_posting.findFirst({
      orderBy: {
        created_time: 'desc'
      }
    });
    
    if (!job) {
      console.log('未找到任何岗位数据');
      return;
    }
    
    const jobId = job.topic_id.toString();
    console.log(`测试岗位ID: ${jobId}, 职位名称: ${job.position_name}`);
    
    // 2. 获取岗位向量 (如果不存在，则生成)
    let jobVector = await ragService.getJobVector(jobId);
    
    if (!jobVector) {
      console.log('岗位向量不存在，正在生成...');
      await ragService.processJob({
        id: jobId,
        title: job.position_name,
        description: job.content || '',
        companyName: job.company,
        salaryRange: job.min_salary && job.max_salary ? 
          `${job.min_salary}-${job.max_salary}` : undefined,
        location: job.location || undefined,
        responsibilities: job.content2 || undefined,
        requirements: job.content3 || undefined,
        skills: [],
        level: job.lever_name || undefined,
      });
      
      jobVector = await ragService.getJobVector(jobId);
      if (!jobVector) {
        throw new Error('生成岗位向量失败');
      }
    }
    
    console.log('获取到岗位向量，维度:', jobVector.vector.length);
    
    // 3. 使用岗位向量查找匹配的简历
    console.log('\n开始查找与岗位匹配的简历...');
    const matchingResults = await ragService.findSimilarResumes(jobVector.vector, {
      topK: 5,
      minScore: 0.5
    });
    
    console.log(`找到 ${matchingResults.matches.length} 份匹配的简历，搜索用时 ${matchingResults.searchTimeMs}ms`);
    
    if (matchingResults.matches.length > 0) {
      console.log('\n匹配结果:');
      for (let i = 0; i < matchingResults.matches.length; i++) {
        const match = matchingResults.matches[i];
        console.log(`\n${i+1}. 简历ID: ${match.id}`);
        console.log(`   匹配得分: ${(match.score * 100).toFixed(2)}%`);
        console.log('   元数据:', JSON.stringify(match.metadata, null, 2));
        
        // 尝试获取简历详情
        try {
          const resumeData = await resumePrisma.resume.findUnique({
            where: { id: match.id }
          });
          
          if (resumeData) {
            console.log(`   简历所有者: ${resumeData.userId}`);
            
            // 只输出内容的前100个字符
            if (resumeData.content) {
              const preview = resumeData.content.substring(0, 100) + (resumeData.content.length > 100 ? '...' : '');
              console.log(`   简历内容预览: ${preview}`);
            }
          }
        } catch (error) {
          console.log(`   无法获取简历详情: ${(error as Error).message}`);
        }
      }
    } else {
      console.log('没有找到匹配的简历');
      
      // 4. 如果没有找到匹配的简历，获取一些简历并处理它们
      console.log('\n获取一些简历并生成向量...');
      const resumes = await resumePrisma.resume.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (resumes.length > 0) {
        console.log(`找到 ${resumes.length} 份简历，开始处理...`);
        
        for (const resume of resumes) {
          try {
            console.log(`处理简历 ID: ${resume.id}`);
            await ragService.processResume(resume.id);
            console.log(`简历 ${resume.id} 处理成功`);
          } catch (error) {
            console.error(`简历 ${resume.id} 处理失败: ${(error as Error).message}`);
          }
        }
        
        // 再次尝试搜索
        console.log('\n再次尝试搜索匹配的简历...');
        const newMatchingResults = await ragService.findSimilarResumes(jobVector.vector, {
          topK: 5,
          minScore: 0.3 // 降低阈值以获取更多结果
        });
        
        console.log(`找到 ${newMatchingResults.matches.length} 份匹配的简历，搜索用时 ${newMatchingResults.searchTimeMs}ms`);
        
        if (newMatchingResults.matches.length > 0) {
          console.log('\n匹配结果:');
          for (let i = 0; i < newMatchingResults.matches.length; i++) {
            const match = newMatchingResults.matches[i];
            console.log(`\n${i+1}. 简历ID: ${match.id}`);
            console.log(`   匹配得分: ${(match.score * 100).toFixed(2)}%`);
            console.log('   元数据:', JSON.stringify(match.metadata, null, 2));
          }
        } else {
          console.log('仍然没有找到匹配的简历');
        }
      } else {
        console.log('数据库中没有简历数据');
      }
    }
    
    console.log('\n岗位-简历匹配测试完成');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  } finally {
    // 关闭Prisma连接
    await jobsPrisma.$disconnect();
    await resumePrisma.$disconnect();
    process.exit(0);
  }
}

// 执行测试
testJobResumeMatching(); 