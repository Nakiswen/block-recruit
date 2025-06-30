/**
 * 传统的结构化数据提取服务（不使用AI）
 */
class TraditionalExtractionService {
  
    /**
     * 从简历中提取结构化信息（基于规则和关键词）
     */
    extractResumeInfo(resume: Resume): ResumeStructuredInfo {
      return {
        skills: this.extractSkills(resume),
        experienceYears: this.calculateExperienceYears(resume),
        educationLevel: this.extractEducationLevel(resume),
        industryExperience: this.extractIndustryExperience(resume),
        location: this.extractLocation(resume),
        keyAchievements: this.extractKeyAchievements(resume)
      };
    }
  
    /**
     * 从岗位中提取结构化信息
     */
    extractJobInfo(job: Job): JobStructuredInfo {
      return {
        requiredSkills: this.extractRequiredSkills(job),
        preferredSkills: this.extractPreferredSkills(job),
        experienceYears: this.extractJobExperienceRequirement(job),
        educationLevel: this.extractJobEducationRequirement(job),
        industry: this.extractJobIndustry(job),
        jobLevel: this.extractJobLevel(job),
        keyResponsibilities: this.extractKeyResponsibilities(job)
      };
    }
  
    // ========== 简历信息提取方法 ==========
  
    /**
     * 提取技能（基于关键词匹配）
     */
    private extractSkills(resume: Resume): string[] {
      const skillKeywords = {
        // 编程语言
        programming: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby'],
        // 前端技术
        frontend: ['react', 'vue', 'angular', 'html', 'css', 'sass', 'less', 'webpack', 'vite'],
        // 后端技术
        backend: ['node.js', 'express', 'koa', 'spring', 'django', 'flask', 'laravel'],
        // 数据库
        database: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch'],
        // 云服务
        cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins'],
        // 区块链
        blockchain: ['solidity', 'ethereum', 'bitcoin', 'web3', 'defi', 'nft']
      };
  
      const allText = `${resume.skills?.join(' ') || ''} ${resume.workExperience || ''} ${resume.projects || ''}`.toLowerCase();
      const foundSkills = new Set<string>();
  
      // 遍历所有技能类别
      Object.values(skillKeywords).flat().forEach(skill => {
        if (allText.includes(skill.toLowerCase())) {
          foundSkills.add(skill);
        }
      });
  
      // 如果简历本身有技能字段，也包含进来
      if (resume.skills) {
        resume.skills.forEach(skill => foundSkills.add(skill.trim()));
      }
  
      return Array.from(foundSkills);
    }
  
    /**
     * 计算工作年限
     */
    private calculateExperienceYears(resume: Resume): number {
      if (!resume.workExperience) return 0;
  
      // 使用正则表达式匹配年份
      const yearPattern = /(\d{4})\s*[-到至]\s*(\d{4}|现在|至今)/gi;
      const matches = resume.workExperience.match(yearPattern);
      
      if (!matches) return 0;
  
      let totalYears = 0;
      const currentYear = new Date().getFullYear();
  
      matches.forEach(match => {
        const [, startYear, endYear] = match.match(/(\d{4})\s*[-到至]\s*(\d{4}|现在|至今)/i) || [];
        if (startYear) {
          const start = parseInt(startYear);
          const end = endYear && !['现在', '至今'].includes(endYear) ? parseInt(endYear) : currentYear;
          totalYears += Math.max(0, end - start);
        }
      });
  
      return Math.min(totalYears, 50); // 限制最大年限
    }
  
    /**
     * 提取教育水平
     */
    private extractEducationLevel(resume: Resume): string {
      if (!resume.education) return '';
  
      const text = resume.education.toLowerCase();
      
      // 按优先级检查学历
      if (text.includes('博士') || text.includes('phd')) return '博士';
      if (text.includes('硕士') || text.includes('研究生') || text.includes('master')) return '硕士';
      if (text.includes('本科') || text.includes('学士') || text.includes('bachelor')) return '本科';
      if (text.includes('专科') || text.includes('大专')) return '大专';
      if (text.includes('高中')) return '高中';
      
      return '本科'; // 默认值
    }
  
    /**
     * 提取行业经验
     */
    private extractIndustryExperience(resume: Resume): string[] {
      const industryKeywords = {
        'IT/互联网': ['软件开发', '互联网', 'IT', '科技', '程序员', '开发工程师'],
        '金融': ['银行', '证券', '保险', '基金', '金融', 'fintech'],
        '区块链': ['区块链', 'blockchain', 'defi', 'nft', 'web3', '数字货币'],
        '电商': ['电商', '电子商务', '淘宝', '京东', '亚马逊'],
        '游戏': ['游戏', '手游', '网游', 'unity', 'cocos'],
        '教育': ['教育', '培训', '在线教育', 'k12'],
        '医疗': ['医疗', '健康', '医院', '制药'],
        '制造业': ['制造', '工厂', '生产', '汽车', '机械']
      };
  
      const allText = `${resume.workExperience || ''} ${resume.projects || ''} ${resume.summary || ''}`.toLowerCase();
      const industries = new Set<string>();
  
      Object.entries(industryKeywords).forEach(([industry, keywords]) => {
        if (keywords.some(keyword => allText.includes(keyword.toLowerCase()))) {
          industries.add(industry);
        }
      });
  
      return Array.from(industries);
    }
  
    /**
     * 提取地理位置
     */
    private extractLocation(resume: Resume): string {
      // 简单的城市匹配
      const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安'];
      const allText = `${resume.summary || ''} ${resume.workExperience || ''}`;
      
      for (const city of cities) {
        if (allText.includes(city)) {
          return city;
        }
      }
      
      return '';
    }
  
    /**
     * 提取关键成就
     */
    private extractKeyAchievements(resume: Resume): string[] {
      const achievementKeywords = [
        '获得', '荣获', '获奖', '认证', '专利', '发明', 
        '负责', '主导', '领导', '管理', '优化', '提升',
        '降低', '增加', '节省', '改进'
      ];
  
      const workExp = resume.workExperience || '';
      const projects = resume.projects || '';
      const achievements: string[] = [];
  
      // 简单的句子分割和关键词匹配
      const sentences = (workExp + ' ' + projects).split(/[。！？；\n]/).filter(s => s.trim());
      
      sentences.forEach(sentence => {
        if (achievementKeywords.some(keyword => sentence.includes(keyword))) {
          achievements.push(sentence.trim());
        }
      });
  
      return achievements.slice(0, 5); // 限制数量
    }
  
    // ========== 岗位信息提取方法 ==========
  
    /**
     * 提取必备技能
     */
    private extractRequiredSkills(job: Job): string[] {
      const requiredKeywords = ['必须', '必备', '要求', '掌握', '熟练', '精通'];
      const skillText = `${job.requirements || ''} ${job.description || ''}`;
      
      return this.extractSkillsFromText(skillText, requiredKeywords);
    }
  
    /**
     * 提取加分技能
     */
    private extractPreferredSkills(job: Job): string[] {
      const preferredKeywords = ['优先', '加分', '了解', '接触过', '有经验'];
      const skillText = `${job.requirements || ''} ${job.description || ''}`;
      
      return this.extractSkillsFromText(skillText, preferredKeywords);
    }
  
    /**
     * 从文本中提取技能
     */
    private extractSkillsFromText(text: string, contextKeywords: string[]): string[] {
      const skills = new Set<string>();
      const skillPatterns = [
        /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Go|Rust|PHP|Ruby)\b/gi,
        /\b(React|Vue|Angular|Node\.js|Express|Spring|Django|Flask)\b/gi,
        /\b(MySQL|PostgreSQL|MongoDB|Redis|Docker|Kubernetes)\b/gi,
        /\b(AWS|Azure|GCP|Jenkins|Git|Linux)\b/gi
      ];
  
      skillPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => skills.add(match));
        }
      });
  
      return Array.from(skills);
    }
  
    /**
     * 提取经验年限要求
     */
    private extractJobExperienceRequirement(job: Job): number {
      const text = `${job.requirements || ''} ${job.description || ''}`;
      const expPattern = /(\d+)\s*[-到至以上]\s*(\d+)?\s*年/g;
      const matches = text.match(expPattern);
      
      if (matches) {
        const numbers = matches[0].match(/\d+/g);
        return numbers ? parseInt(numbers[0]) : 0;
      }
      
      return 0;
    }
  
    /**
     * 提取学历要求
     */
    private extractJobEducationRequirement(job: Job): string {
      const text = `${job.requirements || ''} ${job.description || ''}`.toLowerCase();
      
      if (text.includes('博士')) return '博士';
      if (text.includes('硕士') || text.includes('研究生')) return '硕士';
      if (text.includes('本科') || text.includes('学士')) return '本科';
      if (text.includes('专科') || text.includes('大专')) return '大专';
      
      return '本科';
    }
  
    /**
     * 提取行业信息
     */
    private extractJobIndustry(job: Job): string {
      // 基于公司名称和岗位描述推断行业
      const text = `${job.companyName || ''} ${job.description || ''}`.toLowerCase();
      
      if (text.includes('区块链') || text.includes('web3')) return '区块链';
      if (text.includes('金融') || text.includes('银行')) return '金融';
      if (text.includes('游戏')) return '游戏';
      if (text.includes('电商')) return '电商';
      if (text.includes('教育')) return '教育';
      
      return 'IT/互联网';
    }
  
    /**
     * 提取岗位级别
     */
    private extractJobLevel(job: Job): string {
      const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();
      
      if (text.includes('总监') || text.includes('vp') || text.includes('director')) return '总监';
      if (text.includes('专家') || text.includes('architect') || text.includes('principal')) return '专家';
      if (text.includes('高级') || text.includes('senior') || text.includes('sr')) return '高级';
      if (text.includes('中级') || text.includes('middle')) return '中级';
      if (text.includes('初级') || text.includes('junior') || text.includes('实习')) return '初级';
      
      return '中级';
    }
  
    /**
     * 提取关键职责
     */
    private extractKeyResponsibilities(job: Job): string[] {
      const responsibilities = job.responsibilities || job.description || '';
      
      // 简单的句子分割
      return responsibilities
        .split(/[；;。\n]/)
        .map(r => r.trim())
        .filter(r => r.length > 10)
        .slice(0, 8);
    }
  }
  
  // ========== 混合方案：传统提取 + AI增强 ==========
  
  class HybridExtractionService {
    constructor(
      private traditionalService: TraditionalExtractionService,
      private aiService: any // 你的 aiService
    ) {}
  
    /**
     * 混合提取：先用传统方法，再用AI验证和补充
     */
    async extractResumeInfoHybrid(resume: Resume): Promise<ResumeStructuredInfo> {
      // 1. 传统方法快速提取
      const traditionalResult = this.traditionalService.extractResumeInfo(resume);
      
      // 2. 判断是否需要AI增强
      const needsAIEnhancement = this.shouldUseAI(traditionalResult, resume);
      
      if (!needsAIEnhancement) {
        return traditionalResult;
      }
      
      // 3. 使用AI进行增强
      try {
        const aiResult = await this.aiService.extractResumeInfo(resume);
        
        // 4. 合并结果
        return this.mergeResults(traditionalResult, aiResult);
      } catch (error) {
        console.warn('AI增强失败，使用传统提取结果:', error);
        return traditionalResult;
      }
    }
  
    /**
     * 判断是否需要使用AI增强
     */
    private shouldUseAI(traditionalResult: ResumeStructuredInfo, resume: Resume): boolean {
      // 如果传统方法提取到的信息不够完整，则使用AI
      return (
        traditionalResult.skills.length < 3 ||
        traditionalResult.experienceYears === 0 ||
        !traditionalResult.educationLevel ||
        traditionalResult.industryExperience.length === 0
      );
    }
  
    /**
     * 合并传统方法和AI的结果
     */
    private mergeResults(
      traditional: ResumeStructuredInfo, 
      ai: ResumeStructuredInfo
    ): ResumeStructuredInfo {
      return {
        skills: [...new Set([...traditional.skills, ...ai.skills])],
        experienceYears: Math.max(traditional.experienceYears, ai.experienceYears),
        educationLevel: ai.educationLevel || traditional.educationLevel,
        industryExperience: [...new Set([...traditional.industryExperience, ...ai.industryExperience])],
        location: ai.location || traditional.location,
        keyAchievements: [...new Set([...traditional.keyAchievements, ...ai.keyAchievements])]
      };
    }
  }
  
  // 使用示例
  const traditionalService = new TraditionalExtractionService();
  const hybridService = new HybridExtractionService(traditionalService, aiService);
  
  export { TraditionalExtractionService, HybridExtractionService };