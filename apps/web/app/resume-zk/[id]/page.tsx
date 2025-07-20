'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from 'ui';

interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
  }[];
  englishLevel: {
    type: string;
    score: string;
    date: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    url?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  verificationStatus: {
    degreeVerified: boolean;
    englishVerified: boolean;
  };
  createdAt: string;
}

export default function ResumeDisplayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // For now, let's get data from localStorage or API
        const storedData = localStorage.getItem(`resume-${params.id}`);
        if (storedData) {
          setResume(JSON.parse(storedData));
        }

        // Generate QR code for current URL
        const currentUrl = window.location.href;
        generateQRCode(currentUrl);
      } catch (error) {
        console.error('Failed to fetch resume:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params.id]);

  const generateQRCode = async (url: string) => {
    try {
      // 生产环境建议：
      // 1. 使用 npm install qrcode 本地生成
      // 2. 或使用自建服务
      // 3. 当前使用免费API，稳定性有限

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
      setQrCode(qrUrl);

      // TODO: 生产环境替换为：
      // import QRCode from 'qrcode'
      // const qrDataUrl = await QRCode.toDataURL(url)
      // setQrCode(qrDataUrl)
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      // 备用方案：提供文本链接
      console.log('QR Code generation failed, URL:', url);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}年${month}月`;
  };

  const handleEdit = () => {
    router.push('/resume-zk');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600 font-medium">加载简历中...</div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">📄</div>
          <div className="text-xl text-gray-800 font-semibold mb-2">简历未找到</div>
          <div className="text-gray-600 mb-6">该简历可能已被删除或链接无效</div>
          <Button
            onClick={() => router.push('/resume-zk')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
          >
            返回创建简历
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Action bar - only visible on screen */}
      <div className="container mx-auto px-4 max-w-4xl mb-1 print:hidden">
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
          >
            <span>←</span> 返回编辑
          </Button>
          <div className="flex gap-3">
            <Button
              size="sm"
              onClick={() => window.open(window.location.href, '_blank')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>🔗</span> 分享简历
            </Button>
          </div>
        </div>
      </div>

      {/* Resume content */}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden print:shadow-none print:rounded-none border border-gray-200">
          {/* Header */}
          <div className="bg-gray-600 text-white p-6 relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl text-white md:text-3xl font-bold mb-2">{resume.name}</h2>
                <div className="space-y-1 text-gray-300">
                  <div className="flex items-center gap-2 text-sm">
                    <span>📧</span>
                    <span>{resume.email}</span>
                  </div>
                  {resume.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>📱</span>
                      <span>{resume.phone}</span>
                    </div>
                  )}
                  {resume.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>📍</span>
                      <span>{resume.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="text-center print:block">
                  <div className="bg-white/20 rounded-lg p-2">
                    <img
                      src={qrCode}
                      alt="Resume QR Code"
                      className="w-20 h-20 bg-white rounded p-1 mx-auto"
                    />
                    <div className="text-xs text-gray-300 mt-1">扫码查看</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification status banner */}
          {(resume.verificationStatus?.degreeVerified ||
            resume.verificationStatus?.englishVerified) && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <div className="text-green-700 font-medium text-sm">区块链验证状态</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.verificationStatus.degreeVerified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                      ✅ 学历已验证
                    </span>
                  )}
                  {resume.verificationStatus.englishVerified && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                      ✅ 英语水平已验证
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Summary */}
            {resume.summary && (
              <section className="bg-gray-50 rounded-lg p-4 border-l-3 border-gray-400">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  个人简介
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">{resume.summary}</p>
              </section>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <section>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🎓</span>
                    教育背景
                  </h2>
                  {resume.verificationStatus?.degreeVerified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      ✅ 已通过区块链验证
                    </span>
                  )}
                </div>
                <div className="grid gap-3">
                  {resume.education.map((edu, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border ${
                        resume.verificationStatus?.degreeVerified
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                        <h3 className="text-base font-medium text-gray-900">{edu.school}</h3>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="text-gray-700 text-sm">
                        <span className="font-medium">{edu.degree}</span>
                        {edu.major && <span className="text-gray-600"> · {edu.major}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* English Level */}
            {resume.englishLevel.length > 0 && (
              <section>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    英语水平
                  </h2>
                  {resume.verificationStatus?.englishVerified && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      ✅ 已通过区块链验证
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resume.englishLevel.map((level, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border ${
                        resume.verificationStatus?.englishVerified
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 text-sm">{level.type}</span>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDate(level.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  专业技能
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Work Experience */}
            {resume.workExperience.length > 0 && resume.workExperience[0].company && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-lg">💼</span>
                  工作经历
                </h2>
                <div className="space-y-4">
                  {resume.workExperience.map((work, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400 rounded-l-lg"></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-1">
                            {work.position}
                          </h3>
                          <p className="text-gray-700 font-medium text-sm">{work.company}</p>
                        </div>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mt-2 md:mt-0">
                          {formatDate(work.startDate)} -{' '}
                          {work.endDate ? formatDate(work.endDate) : '至今'}
                        </span>
                      </div>
                      {work.description && (
                        <p className="text-gray-700 leading-relaxed text-sm">{work.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && resume.projects[0].name && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  项目经历
                </h2>
                <div className="space-y-4">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <h3 className="text-base font-medium text-gray-900 mb-1">{project.name}</h3>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm mb-3">
                        {project.description}
                      </p>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <span>🔗</span> 查看项目
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && resume.certifications[0].name && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-lg">🏅</span>
                  获得证书
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-medium text-gray-900 text-sm mb-2">{cert.name}</h3>
                      <p className="text-gray-700 text-xs">{cert.issuer}</p>
                      <p className="text-gray-600 text-xs mt-2 bg-gray-200 px-2 py-1 rounded inline-block">
                        {formatDate(cert.date)}
                      </p>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-2"
                        >
                          <span>📜</span> 查看证书
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-4 text-center border-t border-gray-200 print:bg-white">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span>🔐</span>
                <span>此简历受区块链技术保护</span>
              </div>
              <span className="hidden md:inline">·</span>
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>
                  生成时间：{new Date(resume.createdAt || Date.now()).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
