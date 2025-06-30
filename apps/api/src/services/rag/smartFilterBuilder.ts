/**
 * 智能过滤器构建器 - 根据搜索场景和条件构建 Pinecone 过滤器
 */

// 搜索类型枚举
export enum SearchType {
    CANDIDATE_TO_JOB = 'candidate-to-job',    // 求职者搜索职位
    JOB_TO_CANDIDATE = 'job-to-candidate',    // 招聘方搜索求职者
    SIMILAR_JOBS = 'similar-jobs',            // 相似职位推荐
    SIMILAR_CANDIDATES = 'similar-candidates' // 相似求职者推荐
}

// 薪资信息接口
interface SalaryInfo {
    min: number;
    max: number;
    currency?: string;
    period?: 'hourly' | 'daily' | 'monthly' | 'yearly';
}

// 技能匹配配置
interface SkillMatchConfig {
    required?: string[];      // 必需技能
    preferred?: string[];     // 偏好技能
    bonus?: string[];        // 加分技能
    matchMode?: 'strict' | 'flexible' | 'fuzzy'; // 匹配模式
    minimumMatch?: number;   // 最少匹配数量或百分比
}

// 项目经验配置
interface ProjectExperienceConfig {
    domains?: string[];      // 项目领域
    technologies?: string[]; // 使用技术
    scales?: string[];       // 项目规模 (small, medium, large, enterprise)
    roles?: string[];        // 项目角色
    minProjects?: number;    // 最少项目数量
}

// 过滤器构建参数接口
interface FilterBuilderParams {
    searchType: SearchType;
    candidateData?: {
        experienceYears?: number;
        skills?: string[];
        parsedRequiredSkills: string[];
        skillsConfig?: SkillMatchConfig;
        industryExperience?: string[];
        educationLevel?: string;
        location?: string;
        salaryExpectation?: SalaryInfo;
        preferredCompanies?: string[];
        jobLevelPreference?: string[];
        projectExperience?: ProjectExperienceConfig;
        certifications?: string[];
        languages?: string[];
    };
    jobData?: {
        requiredExperienceYears?: number;
        requiredSkills?: string[];
        preferredSkills?: string[];
        skillsConfig?: SkillMatchConfig;
        industry?: string;
        company?: string;
        jobLevel?: string;
        salaryRange?: SalaryInfo;
        educationRequirement?: string;
        location?: string;
        projectRequirements?: ProjectExperienceConfig;
        requiredCertifications?: string[];
        languageRequirements?: string[];
    };
    customFilters?: Record<string, any>;
    strictMode?: boolean; // 严格模式 vs 宽松模式
    salaryTolerance?: number; // 薪资容忍度百分比，默认20%
    skillMatchThreshold?: number; // 技能匹配阈值，默认70%
}

export class SmartFilterBuilder {
    
    /**
     * 构建智能过滤器
     * @param params 过滤器构建参数
     * @returns Pinecone 查询过滤器对象
     */
    static buildFilter(params: FilterBuilderParams): Record<string, any> | undefined {
        const { searchType, candidateData, jobData, customFilters, strictMode = false } = params;
        
        // 如果有自定义过滤器，优先使用
        if (customFilters && Object.keys(customFilters).length > 0) {
            return customFilters;
        }
        
        switch (searchType) {
            case SearchType.CANDIDATE_TO_JOB:
                return this.buildCandidateToJobFilter(candidateData, strictMode, params);
                
            case SearchType.JOB_TO_CANDIDATE:
                return this.buildJobToCandidateFilter(jobData, strictMode, params);
                
            case SearchType.SIMILAR_JOBS:
                return this.buildSimilarJobsFilter(jobData);
                
            case SearchType.SIMILAR_CANDIDATES:
                return this.buildSimilarCandidatesFilter(candidateData);
                
            default:
                console.warn('未知的搜索类型，返回空过滤器');
                return undefined;
        }
    }
    
    /**
     * 构建求职者搜索职位的过滤器
     */
    private static buildCandidateToJobFilter(
        candidateData?: FilterBuilderParams['candidateData'], 
        strictMode = false,
        params?: FilterBuilderParams
    ): Record<string, any> | undefined {
        
        if (!candidateData) return undefined;
        
        const filter: Record<string, any> = {};
        const orConditions: Record<string, any>[] = [];
        
        // 经验年限匹配：求职者经验 >= 职位要求
        if (candidateData.experienceYears !== undefined) {
            if (strictMode) {
                filter.required_experience_years = candidateData.experienceYears;
            } else {
                filter.required_experience_years = { $lte: candidateData.experienceYears };
            }
        }
        
        // 薪资范围匹配
        if (candidateData.salaryExpectation) {
            const salaryFilter = this.buildSalaryFilter(
                candidateData.salaryExpectation, 
                'job_salary', 
                'candidate_expectation',
                params?.salaryTolerance || 20
            );
            if (salaryFilter) {
                Object.assign(filter, salaryFilter);
            }
        }
        
        // 技能匹配
        if (candidateData.skills && candidateData.skills.length > 0) {
            const skillFilter = this.buildSkillMatchFilter(
                candidateData.skills,
                candidateData.skillsConfig,
                'required_skills',
                'preferred_skills',
                params?.skillMatchThreshold || 70
            );
            if (skillFilter) {
                Object.assign(filter, skillFilter);
            }
        }

        // 技能匹配
        if (candidateData.parsedRequiredSkills && candidateData.parsedRequiredSkills.length > 0) {
            const skillFilter = this.buildSkillMatchFilter(
                candidateData.parsedRequiredSkills,
                candidateData.skillsConfig,
                'parsed_required_skills',
                'parsed_preferred_skills',
                params?.skillMatchThreshold || 70
            );
            if (skillFilter) {
                Object.assign(filter, skillFilter);
            }
        }
        
        // 项目经验匹配
        if (candidateData.projectExperience) {
            const projectFilter = this.buildProjectExperienceFilter(
                candidateData.projectExperience,
                'job_project_requirements'
            );
            if (projectFilter) {
                Object.assign(filter, projectFilter);
            }
        }
        
        // 行业匹配
        if (candidateData.industryExperience && candidateData.industryExperience.length > 0) {
            filter.industry = { $in: candidateData.industryExperience };
        }
        
        // 偏好公司
        if (candidateData.preferredCompanies && candidateData.preferredCompanies.length > 0) {
            filter.company = { $in: candidateData.preferredCompanies };
        }
        
        // 职位级别偏好
        if (candidateData.jobLevelPreference && candidateData.jobLevelPreference.length > 0) {
            filter.job_level = { $in: candidateData.jobLevelPreference };
        }
        
        // 认证要求
        if (candidateData.certifications && candidateData.certifications.length > 0) {
            orConditions.push({
                $or: [
                    { required_certifications: { $exists: false } },
                    { required_certifications: { $in: candidateData.certifications } }
                ]
            });
        }
        
        // 语言要求
        if (candidateData.languages && candidateData.languages.length > 0) {
            orConditions.push({
                $or: [
                    { language_requirements: { $exists: false } },
                    { language_requirements: { $in: candidateData.languages } }
                ]
            });
        }
        
        // 地理位置匹配
        if (candidateData.location && candidateData.location !== '未知' && candidateData.location !== 'Not specified') {
            orConditions.push({
                $or: [
                    { location: candidateData.location },
                    { location: "远程" },
                    { location: "Remote" },
                    { location: { $exists: false } }
                ]
            });
        }
        
        // 合并OR条件
        if (orConditions.length > 0) {
            filter.$and = orConditions;
        }
        
        return Object.keys(filter).length > 0 ? filter : undefined;
    }
    
    /**
     * 构建招聘方搜索求职者的过滤器
     */
    private static buildJobToCandidateFilter(
        jobData?: FilterBuilderParams['jobData'], 
        strictMode = false,
        params?: FilterBuilderParams
    ): Record<string, any> | undefined {
        
        if (!jobData) return undefined;
        
        const filter: Record<string, any> = {};
        const orConditions: Record<string, any>[] = [];
        
        // 经验要求：求职者经验 >= 职位要求
        if (jobData.requiredExperienceYears !== undefined) {
            if (strictMode) {
                filter.experience_years = { $gte: jobData.requiredExperienceYears };
            } else {
                const minExp = Math.max(0, jobData.requiredExperienceYears - 1);
                filter.experience_years = { $gte: minExp };
            }
        }
        
        // 薪资匹配
        if (jobData.salaryRange) {
            const salaryFilter = this.buildSalaryFilter(
                jobData.salaryRange,
                'candidate_salary_expectation',
                'job_offer',
                params?.salaryTolerance || 20
            );
            if (salaryFilter) {
                Object.assign(filter, salaryFilter);
            }
        }
        
        // 技能匹配
        const allJobSkills = [
            ...(jobData.requiredSkills || []),
            ...(jobData.preferredSkills || [])
        ];
        if (allJobSkills.length > 0) {
            const skillFilter = this.buildSkillMatchFilter(
                allJobSkills,
                jobData.skillsConfig,
                'candidate_skills',
                'candidate_core_skills',
                params?.skillMatchThreshold || 70
            );
            if (skillFilter) {
                Object.assign(filter, skillFilter);
            }
        }
        
        // 项目经验匹配
        if (jobData.projectRequirements) {
            const projectFilter = this.buildProjectExperienceFilter(
                jobData.projectRequirements,
                'candidate_project_experience'
            );
            if (projectFilter) {
                Object.assign(filter, projectFilter);
            }
        }
        
        // 行业经验匹配
        if (jobData.industry) {
            filter.industry_experience = { $in: [jobData.industry] };
        }
        
        // 教育要求
        if (jobData.educationRequirement && jobData.educationRequirement !== '未明确要求') {
            const educationLevels = this.getEducationHierarchy(jobData.educationRequirement);
            filter.education_level = { $in: educationLevels };
        }
        
        // 认证要求
        if (jobData.requiredCertifications && jobData.requiredCertifications.length > 0) {
            filter.certifications = { $in: jobData.requiredCertifications };
        }
        
        // 语言要求
        if (jobData.languageRequirements && jobData.languageRequirements.length > 0) {
            filter.languages = { $in: jobData.languageRequirements };
        }
        
        // 地理位置
        if (jobData.location && jobData.location !== '远程' && jobData.location !== 'Remote') {
            orConditions.push({
                $or: [
                    { location: jobData.location },
                    { location: "任何地点" },
                    { location: "Anywhere" },
                    { willing_to_relocate: true }
                ]
            });
        }
        
        // 合并OR条件
        if (orConditions.length > 0) {
            filter.$and = orConditions;
        }
        
        return Object.keys(filter).length > 0 ? filter : undefined;
    }
    
    /**
     * 构建薪资过滤器
     */
    private static buildSalaryFilter(
        salary: SalaryInfo,
        targetField: string,
        context: 'job_salary' | 'candidate_expectation' | 'job_offer',
        tolerancePercent = 20
    ): Record<string, any> | undefined {
        
        const tolerance = tolerancePercent / 100;
        const salaryConditions: Record<string, any>[] = [];
        
        if (context === 'candidate_expectation') {
            // 求职者期望薪资，寻找匹配的职位
            const flexibleMin = salary.min * (1 - tolerance);
            const flexibleMax = salary.max * (1 + tolerance);
            
            salaryConditions.push({
                $or: [
                    // 职位薪资与期望有重叠
                    {
                        [`${targetField}.min`]: { $lte: flexibleMax },
                        [`${targetField}.max`]: { $gte: flexibleMin }
                    },
                    // 职位未指定薪资
                    { [targetField]: { $exists: false } }
                ]
            });
        } else if (context === 'job_offer') {
            // 职位提供薪资，寻找合适的候选人
            const flexibleMin = salary.min * (1 - tolerance);
            const flexibleMax = salary.max * (1 + tolerance);
            
            salaryConditions.push({
                $or: [
                    // 候选人期望薪资在范围内
                    {
                        [`${targetField}.min`]: { $gte: flexibleMin },
                        [`${targetField}.max`]: { $lte: flexibleMax }
                    },
                    // 候选人未指定期望薪资
                    { [targetField]: { $exists: false } }
                ]
            });
        }
        
        // 货币匹配
        if (salary.currency) {
            salaryConditions.push({
                $or: [
                    { [`${targetField}.currency`]: salary.currency },
                    { [`${targetField}.currency`]: { $exists: false } }
                ]
            });
        }
        
        return salaryConditions.length > 0 ? { $and: salaryConditions } : undefined;
    }
    
    /**
     * 构建技能匹配过滤器
     */
    private static buildSkillMatchFilter(
        skills: string[],
        config?: SkillMatchConfig,
        primaryField = 'skills',
        secondaryField = 'core_skills',
        matchThreshold = 70
    ): Record<string, any> | undefined {
        
        if (!skills || skills.length === 0) return undefined;
        
        const matchMode = config?.matchMode || 'flexible';
        const minimumMatch = config?.minimumMatch || Math.ceil(skills.length * (matchThreshold / 100));
        
        const skillConditions: Record<string, any>[] = [];
        
        switch (matchMode) {
            case 'strict':
                // 严格模式：必须包含所有技能
                skillConditions.push({
                    [primaryField]: { $all: skills }
                });
                break;
                
            case 'flexible':
                // 灵活模式：匹配一定比例的技能
                if (typeof minimumMatch === 'number' && minimumMatch <= skills.length) {
                    // 使用聚合管道或在应用层处理复杂的技能匹配逻辑
                    skillConditions.push({
                        $or: [
                            { [primaryField]: { $in: skills } },
                            { [secondaryField]: { $in: skills } }
                        ]
                    });
                }
                break;
                
            case 'fuzzy':
                // 模糊模式：包含相关技能的模糊匹配
                const fuzzySkills = this.generateFuzzySkills(skills);
                skillConditions.push({
                    $or: [
                        { [primaryField]: { $in: fuzzySkills } },
                        { [secondaryField]: { $in: fuzzySkills } }
                    ]
                });
                break;
            default:
                // 模糊模式：包含相关技能的模糊匹配
                const detaultSkills = this.generateFuzzySkills(skills);
                skillConditions.push({
                    $or: [
                        { [primaryField]: { $in: detaultSkills } },
                        { [secondaryField]: { $in: detaultSkills } }
                    ]
                });
                break;
        }
        
        // 处理必需、偏好、加分技能
        if (config?.required && config.required.length > 0) {
            skillConditions.push({
                [primaryField]: { $all: config.required }
            });
        }
        
        if (config?.preferred && config.preferred.length > 0) {
            skillConditions.push({
                $or: [
                    { [primaryField]: { $in: config.preferred } },
                    { [secondaryField]: { $in: config.preferred } }
                ]
            });
        }
        
        return skillConditions.length > 0 ? { $and: skillConditions } : undefined;
    }
    
    /**
     * 构建项目经验过滤器
     */
    private static buildProjectExperienceFilter(
        projectConfig: ProjectExperienceConfig,
        targetField = 'project_experience'
    ): Record<string, any> | undefined {
        
        const projectConditions: Record<string, any>[] = [];
        
        // 项目领域匹配
        if (projectConfig.domains && projectConfig.domains.length > 0) {
            projectConditions.push({
                [`${targetField}.domains`]: { $in: projectConfig.domains }
            });
        }
        
        // 技术栈匹配
        if (projectConfig.technologies && projectConfig.technologies.length > 0) {
            projectConditions.push({
                [`${targetField}.technologies`]: { $in: projectConfig.technologies }
            });
        }
        
        // 项目规模匹配
        if (projectConfig.scales && projectConfig.scales.length > 0) {
            projectConditions.push({
                [`${targetField}.scale`]: { $in: projectConfig.scales }
            });
        }
        
        // 项目角色匹配
        if (projectConfig.roles && projectConfig.roles.length > 0) {
            projectConditions.push({
                [`${targetField}.roles`]: { $in: projectConfig.roles }
            });
        }
        
        // 最少项目数量
        if (typeof projectConfig.minProjects === 'number') {
            projectConditions.push({
                [`${targetField}.count`]: { $gte: projectConfig.minProjects }
            });
        }
        
        return projectConditions.length > 0 ? { $and: projectConditions } : undefined;
    }
    
    /**
     * 生成模糊技能匹配
     */
    private static generateFuzzySkills(skills: string[]): string[] {
        const fuzzySkills = [...skills];
        
        // 技能同义词映射
        const skillSynonyms: Record<string, string[]> = {
            'JavaScript': ['JS', 'ECMAScript', 'Node.js'],
            'Python': ['Python3', 'Django', 'Flask'],
            'React': ['ReactJS', 'React.js'],
            'Vue': ['Vue.js', 'VueJS'],
            'Angular': ['AngularJS'],
            'Docker': ['容器化', 'Containerization'],
            'Kubernetes': ['K8s', '容器编排'],
            'AWS': ['Amazon Web Services', '亚马逊云'],
            'Azure': ['Microsoft Azure', '微软云'],
            'MySQL': ['MariaDB'],
            'PostgreSQL': ['Postgres'],
            'MongoDB': ['Mongo'],
            'Redis': ['缓存'],
            'Git': ['版本控制', 'GitHub', 'GitLab']
        };
        
        // 添加同义词
        skills.forEach(skill => {
            if (skillSynonyms[skill]) {
                fuzzySkills.push(...skillSynonyms[skill]);
            }
        });
        
        return [...new Set(fuzzySkills)]; // 去重
    }
    
    /**
     * 构建相似职位搜索的过滤器
     */
    private static buildSimilarJobsFilter(jobData?: FilterBuilderParams['jobData']): Record<string, any> | undefined {
        if (!jobData) return undefined;
        
        const filter: Record<string, any> = {};
        
        // 同行业
        if (jobData.industry) {
            filter.industry = jobData.industry;
        }
        
        // 相似职位级别
        if (jobData.jobLevel) {
            const similarLevels = this.getSimilarJobLevels(jobData.jobLevel);
            filter.job_level = { $in: similarLevels };
        }
        
        // 相似薪资范围
        if (jobData.salaryRange) {
            const tolerance = 0.3; // 30%容忍度
            filter.$or = [
                {
                    'salary_range.min': {
                        $gte: jobData.salaryRange.min * (1 - tolerance),
                        $lte: jobData.salaryRange.min * (1 + tolerance)
                    }
                },
                {
                    'salary_range.max': {
                        $gte: jobData.salaryRange.max * (1 - tolerance),
                        $lte: jobData.salaryRange.max * (1 + tolerance)
                    }
                }
            ];
        }
        
        return Object.keys(filter).length > 0 ? filter : undefined;
    }
    
    /**
     * 构建相似求职者搜索的过滤器
     */
    private static buildSimilarCandidatesFilter(candidateData?: FilterBuilderParams['candidateData']): Record<string, any> | undefined {
        if (!candidateData) return undefined;
        
        const filter: Record<string, any> = {};
        
        // 相似经验年限范围
        if (candidateData.experienceYears !== undefined) {
            const minExp = Math.max(0, candidateData.experienceYears - 2);
            const maxExp = candidateData.experienceYears + 2;
            filter.experience_years = { $gte: minExp, $lte: maxExp };
        }
        
        // 相同行业经验
        if (candidateData.industryExperience && candidateData.industryExperience.length > 0) {
            filter.industry_experience = { $in: candidateData.industryExperience };
        }
        
        // 相似教育背景
        if (candidateData.educationLevel) {
            const similarEducation = this.getSimilarEducationLevels(candidateData.educationLevel);
            filter.education_level = { $in: similarEducation };
        }
        
        // 相似技能集
        if (candidateData.skills && candidateData.skills.length > 0) {
            filter.skills = { $in: candidateData.skills };
        }
        
        // 相似薪资期望
        if (candidateData.salaryExpectation) {
            const tolerance = 0.25; // 25%容忍度
            filter.$or = [
                {
                    'salary_expectation.min': {
                        $gte: candidateData.salaryExpectation.min * (1 - tolerance),
                        $lte: candidateData.salaryExpectation.min * (1 + tolerance)
                    }
                },
                {
                    'salary_expectation.max': {
                        $gte: candidateData.salaryExpectation.max * (1 - tolerance),
                        $lte: candidateData.salaryExpectation.max * (1 + tolerance)
                    }
                }
            ];
        }
        
        return Object.keys(filter).length > 0 ? filter : undefined;
    }
    
    /**
     * 快速过滤器构建方法 - 常用场景
     */
    static quickFilters = {
        // 按公司过滤
        byCompany: (company: string) => ({ company }),
        
        // 按职位标题过滤
        byTitle: (title: string) => ({ title }),
        
        // 按行业过滤
        byIndustry: (industry: string) => ({ industry }),
        
        // 按职位级别过滤
        byJobLevel: (level: string) => ({ job_level: level }),
        
        // 按经验年限范围过滤
        byExperienceRange: (min: number, max: number) => ({
            experience_years: { $gte: min, $lte: max }
        }),
        
        // 按薪资范围过滤
        bySalaryRange: (minSalary: number, maxSalary: number, currency = 'CNY') => ({
            $or: [
                {
                    'salary_range.min': { $lte: maxSalary },
                    'salary_range.max': { $gte: minSalary },
                    'salary_range.currency': currency
                },
                { salary_range: { $exists: false } }
            ]
        }),
        
        // 按技能过滤
        bySkills: (skills: string[], matchAll = false) => ({
            skills: matchAll ? { $all: skills } : { $in: skills }
        }),
        
        // 按认证过滤
        byCertifications: (certifications: string[]) => ({
            certifications: { $in: certifications }
        }),
        
        // 按项目经验过滤
        byProjectExperience: (domains: string[], technologies: string[]) => ({
            $and: [
                { 'project_experience.domains': { $in: domains } },
                { 'project_experience.technologies': { $in: technologies } }
            ]
        }),
        
        // 最近更新的职位
        recentJobs: (days: number = 30) => {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            return {
                update_time: { $gte: cutoffDate.toISOString() }
            };
        },
        
        // 远程工作过滤器
        remoteJobs: () => ({
            $or: [
                { location: "远程" },
                { location: "Remote" },
                { remote_allowed: true }
            ]
        }),
        
        // 组合多个条件
        combine: (...filters: Array<Record<string, any>>) => {
            return filters.reduce((combined, filter) => ({ ...combined, ...filter }), {});
        }
    };
    
    /**
     * 工具方法：获取教育层次
     */
    private static getEducationHierarchy(requirement: string): string[] {
        const hierarchies: Record<string, string[]> = {
            '博士': ['博士', 'PhD', 'Doctor'],
            '硕士': ['博士', 'PhD', 'Doctor', '硕士', 'Master', "Master's"],
            '本科': ['博士', 'PhD', 'Doctor', '硕士', 'Master', "Master's", '本科', 'Bachelor', "Bachelor's"],
            '专科': ['博士', 'PhD', 'Doctor', '硕士', 'Master', "Master's", '本科', 'Bachelor', "Bachelor's", '专科', 'Associate']
        };
        return hierarchies[requirement] || [requirement];
    }
    
    /**
     * 工具方法：获取相似职位级别
     */
    private static getSimilarJobLevels(currentLevel: string): string[] {
        const levelGroups: Record<string, string[]> = {
            '初级': ['初级', '入门', 'Junior', 'Entry'],
            '中级': ['初级', '中级', 'Junior', 'Mid', 'Intermediate'],
            '高级': ['中级', '高级', 'Mid', 'Senior', 'Intermediate'],
            '专家': ['高级', '专家', '首席', 'Senior', 'Expert', 'Principal'],
            '首席': ['专家', '首席', 'Expert', 'Principal', 'Chief']
        };
        return levelGroups[currentLevel] || [currentLevel];
    }
    
    /**
     * 工具方法：获取相似教育水平
     */
    private static getSimilarEducationLevels(currentLevel: string): string[] {
        const similarLevels: Record<string, string[]> = {
            '博士': ['博士', 'PhD', 'Doctor'],
            '硕士': ['硕士', 'Master', "Master's", '博士', 'PhD'],
            '本科': ['本科', 'Bachelor', "Bachelor's", '硕士', 'Master'],
            '专科': ['专科', 'Associate', '本科', 'Bachelor']
        };
        return similarLevels[currentLevel] || [currentLevel];
    }
    
    /**
     * 验证过滤器是否有效
     */
    private static validateFilter(filter: Record<string, any>): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // 检查空过滤器
        if (!filter || Object.keys(filter).length === 0) {
            warnings.push('过滤器为空，将返回所有结果');
        }
        
        // 检查不支持的操作符
        const supportedOperators = ['$eq', '$ne', '$in', '$nin', '$lt', '$lte', '$gt', '$gte', '$exists', '$or', '$and', '$all'];
        
        const checkOperators = (obj: any, path = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;
                
                if (key.startsWith(') && !supportedOperators.includes(key)')) {
                    errors.push(`不支持的操作符: ${key} 在路径 ${currentPath}`);
                }
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkOperators(value, currentPath);
                }
            }
        };
        
        checkOperators(filter);
        
        // 检查薪资范围的有效性
        this.validateSalaryRanges(filter, errors, warnings);
        
        // 检查技能匹配的有效性
        this.validateSkillMatches(filter, errors, warnings);
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    
    /**
     * 验证薪资范围
     */
    private static validateSalaryRanges(filter: any, errors: string[], warnings: string[]): void {
        const checkSalaryRange = (obj: any, path = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;
                
                if (key.includes('salary') && typeof value === 'object' && value !== null) {
                    if ('min' in value && 'max' in value) {
                        if (typeof value.min === 'number' && typeof value.max === 'number') {
                            if (value.min > value.max) {
                                errors.push(`薪资范围无效: 最小值(${value.min})大于最大值(${value.max}) 在路径 ${currentPath}`);
                            }
                            if (value.min < 0 || value.max < 0) {
                                errors.push(`薪资范围无效: 薪资不能为负数 在路径 ${currentPath}`);
                            }
                            if (value.max > 1000000) {
                                warnings.push(`薪资范围可能过高: ${value.max} 在路径 ${currentPath}`);
                            }
                        }
                    }
                }
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkSalaryRange(value, currentPath);
                }
            }
        };
        
        checkSalaryRange(filter);
    }
    
    /**
     * 验证技能匹配
     */
    private static validateSkillMatches(filter: any, errors: string[], warnings: string[]): void {
        const checkSkills = (obj: any, path = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;
                
                if (key.includes('skill') && Array.isArray(value)) {
                    if (value.length === 0) {
                        warnings.push(`技能列表为空 在路径 ${currentPath}`);
                    }
                    if (value.length > 50) {
                        warnings.push(`技能列表过长(${value.length}项), 可能影响查询性能 在路径 ${currentPath}`);
                    }
                    
                    // 检查技能名称格式
                    value.forEach((skill, index) => {
                        if (typeof skill !== 'string') {
                            errors.push(`技能项必须是字符串类型 在路径 ${currentPath}[${index}]`);
                        } else if (skill.trim().length === 0) {
                            errors.push(`技能项不能为空 在路径 ${currentPath}[${index}]`);
                        }
                    });
                }
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkSkills(value, currentPath);
                }
            }
        };
        
        checkSkills(filter);
    }
    
    /**
     * 优化过滤器性能
     */
    static optimizeFilter(filter: Record<string, any>): Record<string, any> {
        // 移除空条件
        const removeEmptyConditions = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.filter(item => item != null).map(removeEmptyConditions);
            }
            
            if (typeof obj === 'object' && obj !== null) {
                const cleaned: any = {};
                for (const [key, value] of Object.entries(obj)) {
                    const cleanValue = removeEmptyConditions(value);
                    if (cleanValue != null && 
                        !(Array.isArray(cleanValue) && cleanValue.length === 0) &&
                        !(typeof cleanValue === 'object' && Object.keys(cleanValue).length === 0)) {
                        cleaned[key] = cleanValue;
                    }
                }
                return Object.keys(cleaned).length > 0 ? cleaned : null;
            }
            
            return obj;
        };
        
        // 合并相同字段的条件
        const mergeConditions = (obj: any): any => {
            if (typeof obj !== 'object' || obj === null) return obj;
            
            const merged: any = {};
            for (const [key, value] of Object.entries(obj)) {
                if (key === '$and' && Array.isArray(value)) {
                    // 扁平化嵌套的$and条件
                    const flattened: any[] = [];
                    value.forEach(condition => {
                        if (typeof condition === 'object' && condition.$and) {
                            flattened.push(...condition.$and);
                        } else {
                            flattened.push(condition);
                        }
                    });
                    merged[key] = flattened;
                } else if (key === '$or' && Array.isArray(value)) {
                    // 扁平化嵌套的$or条件
                    const flattened: any[] = [];
                    value.forEach(condition => {
                        if (typeof condition === 'object' && condition.$or) {
                            flattened.push(...condition.$or);
                        } else {
                            flattened.push(condition);
                        }
                    });
                    merged[key] = flattened;
                } else {
                    merged[key] = mergeConditions(value);
                }
            }
            return merged;
        };
        
        let optimized = removeEmptyConditions(filter);
        optimized = mergeConditions(optimized);
        
        return optimized || {};
    }
    
    /**
     * 获取过滤器统计信息
     */
    static getFilterStats(filter: Record<string, any>): {
        totalConditions: number;
        fieldCount: number;
        operatorCount: Record<string, number>;
        complexity: 'simple' | 'moderate' | 'complex';
        estimatedSelectivity: number;
    } {
        let totalConditions = 0;
        const fields = new Set<string>();
        const operators: Record<string, number> = {};
        
        const analyze = (obj: any, path = '') => {
            if (typeof obj !== 'object' || obj === null) return;
            
            for (const [key, value] of Object.entries(obj)) {
                const fullPath = path ? `${path}.${key}` : key;
                
                if (key.startsWith('$')) {
                    operators[key] = (operators[key] || 0) + 1;
                    totalConditions++;
                } else if (!key.startsWith('$')) {
                    fields.add(fullPath);
                }
                
                if (typeof value === 'object' && value !== null) {
                    analyze(value, fullPath);
                }
            }
        };
        
        analyze(filter);
        
        // 计算复杂度
        let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
        if (totalConditions > 10 || fields.size > 8) {
            complexity = 'complex';
        } else if (totalConditions > 5 || fields.size > 4) {
            complexity = 'moderate';
        }
        
        // 估算选择性（简单启发式）
        let estimatedSelectivity = 1.0;
        if (operators['$eq']) estimatedSelectivity *= 0.1;
        if (operators['$in']) estimatedSelectivity *= 0.3;
        if (operators['$gte'] || operators['$lte']) estimatedSelectivity *= 0.5;
        if (operators['$or']) estimatedSelectivity *= 1.5;
        
        estimatedSelectivity = Math.min(1.0, Math.max(0.01, estimatedSelectivity));
        
        return {
            totalConditions,
            fieldCount: fields.size,
            operatorCount: operators,
            complexity,
            estimatedSelectivity
        };
    }
    
    /**
     * 将过滤器转换为人类可读的描述
     */
    static describeFilter(filter: Record<string, any>): string {
        const descriptions: string[] = [];
        
        const describe = (obj: any, context = ''): void => {
            if (typeof obj !== 'object' || obj === null) return;
            
            for (const [key, value] of Object.entries(obj)) {
                if (key === 'experience_years') {
                    if (typeof value === 'number') {
                        descriptions.push(`工作经验: ${value}年`);
                    } else if (typeof value === 'object') {
                        if (value.$gte && value.$lte) {
                            descriptions.push(`工作经验: ${value.$gte}-${value.$lte}年`);
                        } else if (value.$gte) {
                            descriptions.push(`工作经验: ≥${value.$gte}年`);
                        } else if (value.$lte) {
                            descriptions.push(`工作经验: ≤${value.$lte}年`);
                        }
                    }
                } else if (key === 'salary_range' || key.includes('salary')) {
                    if (typeof value === 'object' && value.min && value.max) {
                        const currency = value.currency || 'CNY';
                        descriptions.push(`薪资范围: ${value.min}-${value.max} ${currency}`);
                    }
                } else if (key === 'skills' || key.includes('skill')) {
                    if (Array.isArray(value)) {
                        descriptions.push(`技能要求: ${value.join(', ')}`);
                    } else if (typeof value === 'object' && value.$in) {
                        descriptions.push(`技能匹配: ${value.$in.join(', ')}`);
                    }
                } else if (key === 'industry') {
                    if (typeof value === 'string') {
                        descriptions.push(`行业: ${value}`);
                    } else if (typeof value === 'object' && value.$in) {
                        descriptions.push(`行业: ${value.$in.join(' 或 ')}`);
                    }
                } else if (key === 'location') {
                    if (typeof value === 'string') {
                        descriptions.push(`地点: ${value}`);
                    }
                } else if (key === 'job_level') {
                    if (typeof value === 'string') {
                        descriptions.push(`职位级别: ${value}`);
                    } else if (typeof value === 'object' && value.$in) {
                        descriptions.push(`职位级别: ${value.$in.join(' 或 ')}`);
                    }
                } else if (key === 'company') {
                    if (typeof value === 'string') {
                        descriptions.push(`公司: ${value}`);
                    } else if (typeof value === 'object' && value.$in) {
                        descriptions.push(`偏好公司: ${value.$in.join(', ')}`);
                    }
                } else if (key === '$or' && Array.isArray(value)) {
                    const orDescriptions: string[] = [];
                    value.forEach(condition => {
                        const tempDescs: string[] = [];
                        const originalLength = descriptions.length;
                        describe(condition);
                        orDescriptions.push(descriptions.slice(originalLength).join(' 且 '));
                        descriptions.splice(originalLength);
                    });
                    if (orDescriptions.length > 0) {
                        descriptions.push(`(${orDescriptions.join(' 或 ')})`);
                    }
                } else if (typeof value === 'object') {
                    describe(value, key);
                }
            }
        };
        
        describe(filter);
        
        return descriptions.length > 0 
            ? `筛选条件: ${descriptions.join(' · ')}` 
            : '无特定筛选条件';
    }
}