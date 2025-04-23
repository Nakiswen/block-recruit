export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    links: { label: string; url: string }[];
  };
  summary: string;
  skills: string[];
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights: string[];
    technologies: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  rawText: string;
}

export interface SkillMatch {
  skill: string;
  category: 'blockchain' | 'web3' | 'defi' | 'nft' | 'dao' | 'programming' | 'other';
  relevance: number; // 0-10
  level?: 'beginner' | 'intermediate' | 'expert';
}

export interface ExperienceMatch {
  company: string;
  position: string;
  relevance: number; // 0-10
  duration: number; // in months
  web3Related: boolean;
}

export interface EvaluationResult {
  overallScore: number; // 0-10
  skillsScore: number; // 0-10
  experienceScore: number; // 0-10
  educationScore: number; // 0-10
  projectsScore: number; // 0-10
  matchingSkills: SkillMatch[];
  relevantExperience: ExperienceMatch[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface JobRequirement {
  title: string;
  level: 'junior' | 'mid' | 'senior';
  skills: {
    required: string[];
    preferred: string[];
  };
  experience: {
    minYears: number;
    requiredFields: string[];
  };
  education?: {
    minLevel: 'highSchool' | 'associate' | 'bachelor' | 'master' | 'phd';
    preferredFields?: string[];
  };
} 