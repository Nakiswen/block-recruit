import { atom } from 'jotai';

export interface ManualResumeData {
  // 基本信息
  name: string;
  email: string;
  phone: string;
  location: string;

  // 个人简介
  summary: string;

  // 工作经历
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  // 教育背景（重要：需要验证）
  education: {
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
  }[];

  // 英语等级（重要：需要验证）
  englishLevel: {
    type: string; // CET4, CET6, IELTS, TOEFL, etc.
    score: string;
    date: string;
  }[];

  // 技能清单
  skills: string[];

  // 项目经历
  projects: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    url?: string;
  }[];

  // 证书
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
}

// 表单数据原子
export const resumeFormDataAtom = atom<ManualResumeData>({
  name: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  workExperience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  education: [{ school: '', degree: '', major: '', startDate: '', endDate: '' }],
  englishLevel: [{ type: '', score: '', date: '' }],
  skills: [],
  projects: [{ name: '', description: '', startDate: '', endDate: '', url: '' }],
  certifications: [{ name: '', issuer: '', date: '', url: '' }],
});

// 验证状态原子
export const verificationStatusAtom = atom({
  degreeVerified: false,
  englishVerified: false,
});

// 持久化表单数据到localStorage的原子
export const persistedResumeFormDataAtom = atom(
  get => get(resumeFormDataAtom),
  (get, set, newValue: ManualResumeData) => {
    set(resumeFormDataAtom, newValue);
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume-draft', JSON.stringify(newValue));
    }
  }
);

// 持久化验证状态到localStorage的原子
export const persistedVerificationStatusAtom = atom(
  get => get(verificationStatusAtom),
  (get, set, newValue: { degreeVerified: boolean; englishVerified: boolean }) => {
    set(verificationStatusAtom, newValue);
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('resume-verification-status', JSON.stringify(newValue));
    }
  }
);

// 从localStorage恢复数据的原子
export const loadDraftDataAtom = atom(null, (get, set) => {
  if (typeof window !== 'undefined') {
    // 恢复表单数据
    const saved = localStorage.getItem('resume-draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        set(resumeFormDataAtom, data);
      } catch (error) {
        console.error('Failed to load draft data:', error);
      }
    }

    // 恢复验证状态
    const savedVerification = localStorage.getItem('resume-verification-status');
    if (savedVerification) {
      try {
        const verificationData = JSON.parse(savedVerification);
        set(verificationStatusAtom, verificationData);
      } catch (error) {
        console.error('Failed to load verification status:', error);
      }
    }
  }
});
