/**
 * 测试 V2 版本的匹配服务
 * 验证结构化过滤 → 向量召回 → 技能精确匹配精排 → 语义补充的完整流程
 */

import { ragServiceV2 } from '../services/rag/ragServiceV2.js';
import { ragService } from '../services/rag/ragService.js';
import { resumePrisma, jobsPrisma } from '../prisma/client.js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function testMatchingV2() {
  try {
    console.log('🚀 开始测试 V2 匹配服务...\n');

    // 初始化 RAG 服务
    console.log('📦 初始化 RAG 服务...');
    await ragService.init();
    console.log('✅ RAG 服务初始化成功\n');

    // 获取最新的简历
    console.log('📄 获取测试简历...');
    const resume = await resumePrisma.resume.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!resume) {
      console.log('❌ 没有找到简历数据');
      return;
    }

    console.log(`✅ 找到简历: ${resume.id}`);
    console.log(`   标题: ${resume.title || '无标题'}`);
    console.log(`   状态: ${resume.status}`);
    console.log(`   内容长度: ${resume.content?.length || 0} 字符\n`);

    // 使用 V2 版本处理简历并查找匹配
    console.log('🔍 使用 V2 版本处理简历并查找匹配岗位...\n');
    console.log('='.repeat(60));

    const startTime = Date.now();
    const result = await ragServiceV2.processResumeAndFindMatchesV2(resume.id);
    const endTime = Date.now();

    console.log('='.repeat(60));
    console.log(`\n⏱️  处理耗时: ${endTime - startTime}ms\n`);

    // 显示匹配结果
    console.log(`📊 匹配结果: 找到 ${result.matches.length} 个匹配岗位\n`);

    if (result.matches.length > 0) {
      console.log('🏆 Top 匹配岗位:\n');

      for (let i = 0; i < Math.min(5, result.matches.length); i++) {
        const match = result.matches[i];
        console.log(`[${i + 1}] ${match.metadata.title || '未知岗位'}`);
        console.log(`    公司: ${match.metadata.company || '未知'}`);
        console.log(`    综合分: ${(match.score * 100).toFixed(1)}%`);
        console.log(`    技能匹配分: ${(match.skillMatchScore * 100).toFixed(1)}%`);
        console.log(`    岗位类型匹配分: ${(match.jobTypeMatchScore * 100).toFixed(1)}%`);
        console.log(`    向量相似度: ${(match.vectorScore * 100).toFixed(1)}%`);
        console.log(`    经验匹配分: ${(match.experienceMatchScore * 100).toFixed(1)}%`);
        console.log(
          `    匹配技能: ${match.matchedSkills.slice(0, 5).join(', ')}${match.matchedSkills.length > 5 ? '...' : ''}`
        );
        console.log(
          `    缺失技能: ${match.missingSkills.slice(0, 5).join(', ')}${match.missingSkills.length > 5 ? '...' : ''}`
        );

        // 显示语义匹配信息
        if (match.semanticBonus && match.semanticBonus > 0) {
          console.log(`    语义加分: +${(match.semanticBonus * 100).toFixed(1)}%`);
        }
        if (match.filterRelaxed) {
          console.log(`    ⚠️ 过滤条件已放宽到级别 ${match.relaxLevel}`);
        }
        console.log('');
      }

      // 统计分析
      console.log('📈 匹配统计:');
      const avgScore = result.matches.reduce((sum, m) => sum + m.score, 0) / result.matches.length;
      const avgSkillMatch =
        result.matches.reduce((sum, m) => sum + m.skillMatchScore, 0) / result.matches.length;
      const avgVectorScore =
        result.matches.reduce((sum, m) => sum + m.vectorScore, 0) / result.matches.length;

      console.log(`    平均综合分: ${(avgScore * 100).toFixed(1)}%`);
      console.log(`    平均技能匹配分: ${(avgSkillMatch * 100).toFixed(1)}%`);
      console.log(`    平均向量相似度: ${(avgVectorScore * 100).toFixed(1)}%`);

      // 检查是否有过滤放宽的情况
      const relaxedCount = result.matches.filter(m => m.filterRelaxed).length;
      if (relaxedCount > 0) {
        console.log(`    过滤放宽的结果: ${relaxedCount}/${result.matches.length}`);
      }
    }

    console.log('\n✅ V2 匹配服务测试完成');
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  } finally {
    await resumePrisma.$disconnect();
    await jobsPrisma.$disconnect();
    process.exit(0);
  }
}

// 执行测试
testMatchingV2();
