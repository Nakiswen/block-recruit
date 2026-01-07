import * as jobsModel from '@/models/jobsModel';
import redis from '@/utils/redis';
import type { job_posting } from '@/prisma/web3jobs';
import type { CreateJobDTO } from '@/types/job.dto';
import { validateCreateJobDTO } from '@/types/job.dto';

/**
 * 获取岗位列表 Service
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 岗位列表、总数和缓存标记
 */
export async function getJobList(
  page: number,
  pageSize: number,
  keyword?: string
): Promise<{ jobs: any[]; total: number; cache: boolean }> {
  const skip = (page - 1) * pageSize;
  const normalizedKeyword = keyword?.trim() || '';
  const cacheKey = `job_list_${page}_${pageSize}_${normalizedKeyword}`;
  // 优先查缓存
  const cacheData = await redis.get(cacheKey);
  if (cacheData) {
    const cachedResult = JSON.parse(cacheData);
    return { ...cachedResult, cache: true };
  }
  // 查询数据库
  const { jobs: jobsData, total } = await jobsModel.getJobList(skip, pageSize, normalizedKeyword);

  // 将数据库字段映射为前端需要的格式
  const jobs = jobsData.map(job => ({
    id: job.topic_id.toString(),
    title: job.position_name,
    company: job.company,
    description: job.content5 || '',
    responsibilities: job.content || '',
    requirements: job.content2 || '',
    benefits: job.content3 || '',
    companyIntroduction: job.company_introduction || '',
    companyWebsite: job.company_website || '',
    location: job.location || '',
    salary:
      job.min_salary && job.max_salary
        ? `${job.min_salary}-${job.max_salary}`
        : job.min_salary
          ? `${job.min_salary}+`
          : job.max_salary
            ? `最高${job.max_salary}`
            : '',
    createdAt: job.create_time
      ? new Date(Number(job.create_time) * 1000).toISOString()
      : new Date().toISOString(),
  }));

  const result = { jobs, total };
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 60); // 缓存60秒
  return { ...result, cache: false };
}

/**
 * 创建岗位 Service
 * @param jobData 岗位数据
 * @param userId 创建者用户ID (可选)
 * @returns 创建结果
 */
export async function createManualJob(
  jobData: CreateJobDTO,
  userId?: string
): Promise<{ jobId: string; vectorized: boolean }> {
  // 验证数据
  const validation = validateCreateJobDTO(jobData);
  if (!validation.valid) {
    throw new Error(`数据验证失败: ${validation.errors.join(', ')}`);
  }

  // 生成唯一的 topic_id
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const topicId = `manual_${timestamp}_${randomId}`;

  // 准备数据库字段
  const createData = {
    topic_id: topicId,
    position_name: jobData.positionName,
    company: jobData.company,
    content: jobData.responsibilities || '',
    content2: jobData.requirements || '',
    content3: jobData.benefits || '',
    content5: jobData.description || '',
    min_salary: jobData.minSalary,
    max_salary: jobData.maxSalary,
    location: jobData.location || '',
    work_type_name: jobData.workTypeName || '',
    office_mode_name: jobData.officeModeName || '',
    lever_name: jobData.leverName || '',
    company_introduction: jobData.companyIntroduction || '',
    company_website: jobData.companyWebsite || '',
    company_logo: jobData.companyLogo || '',
    company_size_name: jobData.companySizeName || '',
    email: jobData.email || '',
    phone: jobData.phone || '',
    wechat: jobData.wechat || '',
    telegram: jobData.telegram || '',
    create_time: BigInt(Math.floor(timestamp / 1000)), // 转换为秒级时间戳
    ffrom: 'manual_upload', // 标记为手动上传
    status: 0, // 默认状态为激活
  };

  // 创建岗位
  const createdJob = await jobsModel.createJobPosting(createData);

  // 清除岗位列表缓存
  await clearJobListCache();

  // 异步向量化处理 (不阻塞响应)
  let vectorized = false;
  try {
    // 动态导入 RAG 服务避免循环依赖
    const { ragService } = await import('@/services/rag/ragService');

    // 准备岗位数据用于向量化
    const jobForVectorization = {
      id: topicId,
      title: jobData.positionName,
      company: jobData.company,
      description: jobData.description || jobData.responsibilities || '',
      responsibilities: jobData.responsibilities || '',
      requirements: jobData.requirements || '',
      benefits: jobData.benefits || '',
      companyIntroduction: jobData.companyIntroduction || '',
      companyWebsite: jobData.companyWebsite || '',
      location: jobData.location || '',
      salary: formatSalary(jobData.minSalary, jobData.maxSalary),
      createdAt: new Date(timestamp).toISOString(),
    };

    // 调用 RAG 服务进行向量化
    await ragService.processJob(jobForVectorization);
    vectorized = true;
  } catch (error) {
    // 向量化失败不影响岗位创建
    console.error('岗位向量化失败:', error);
  }

  return {
    jobId: topicId,
    vectorized,
  };
}

/**
 * 清除岗位列表缓存
 */
async function clearJobListCache(): Promise<void> {
  try {
    const keys = await redis.keys('job_list_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
}

/**
 * 格式化薪资范围
 */
function formatSalary(minSalary?: number, maxSalary?: number): string {
  if (minSalary && maxSalary) {
    return `${minSalary}-${maxSalary}`;
  } else if (minSalary) {
    return `${minSalary}+`;
  } else if (maxSalary) {
    return `最高${maxSalary}`;
  }
  return '';
}
