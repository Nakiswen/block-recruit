/**
 * 岗位上传 DTO (Data Transfer Object)
 * 用于主动上传岗位接口的数据传输
 */

/**
 * 创建岗位请求体
 */
export interface CreateJobDTO {
  // 必填字段
  positionName: string; // 职位名称
  company: string; // 公司名称

  // 职位描述 (至少提供一个)
  description?: string; // 主要职位描述 (对应 content5)
  responsibilities?: string; // 工作职责详情 (对应 content)
  requirements?: string; // 岗位要求详情 (对应 content2)
  benefits?: string; // 福利待遇 (对应 content3)

  // 薪资信息
  minSalary?: number; // 最低薪资
  maxSalary?: number; // 最高薪资

  // 工作信息
  location?: string; // 工作地点
  workTypeName?: string; // 工作类型 (全职/兼职等)
  officeModeName?: string; // 办公模式 (远程/现场等)
  leverName?: string; // 职级名称 (初级/中级/高级等)

  // 公司信息
  companyIntroduction?: string; // 公司介绍
  companyWebsite?: string; // 公司官网
  companyLogo?: string; // 公司logo URL
  companySizeName?: string; // 公司规模

  // 联系方式
  email?: string; // 联系邮箱
  phone?: string; // 联系电话
  wechat?: string; // 微信联系方式
  telegram?: string; // Telegram联系方式

  // 标签
  tags?: string[]; // 岗位标签列表
}

/**
 * 岗位上传响应
 */
export interface UploadJobResponse {
  code: number;
  message: string;
  data: {
    jobId: string; // 创建的岗位ID
    vectorized: boolean; // 是否已向量化
  };
}

/**
 * 验证创建岗位数据的函数
 */
export function validateCreateJobDTO(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 验证必填字段
  if (
    !data.positionName ||
    typeof data.positionName !== 'string' ||
    data.positionName.trim() === ''
  ) {
    errors.push('职位名称不能为空');
  }

  if (!data.company || typeof data.company !== 'string' || data.company.trim() === '') {
    errors.push('公司名称不能为空');
  }

  // 至少需要一个描述字段
  const hasDescription = data.description || data.responsibilities || data.requirements;
  if (!hasDescription) {
    errors.push('至少需要提供一个职位描述字段 (description/responsibilities/requirements)');
  }

  // 验证薪资范围
  if (data.minSalary !== undefined && data.maxSalary !== undefined) {
    const minSalary = Number(data.minSalary);
    const maxSalary = Number(data.maxSalary);

    if (isNaN(minSalary) || isNaN(maxSalary)) {
      errors.push('薪资必须是有效数字');
    } else if (minSalary > maxSalary) {
      errors.push('最低薪资不能大于最高薪资');
    } else if (minSalary < 0 || maxSalary < 0) {
      errors.push('薪资不能为负数');
    }
  }

  // 验证标签
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('标签必须是数组格式');
    } else if (data.tags.some((tag: any) => typeof tag !== 'string')) {
      errors.push('标签必须是字符串数组');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
