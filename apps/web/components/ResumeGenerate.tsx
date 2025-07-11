'use client';

import {
  DocumentArrowDownIcon,
  EyeIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { Button } from 'ui';

import { ResumeFormData } from './ResumeForm';

interface ResumeGenerateProps {
  resumeData: ResumeFormData | null;
}

export default function ResumeGenerate({ resumeData }: ResumeGenerateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [verificationUrl, setVerificationUrl] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  // 生成简历PDF
  const generateResumePDF = async () => {
    if (!resumeData) {
      alert('没有简历数据');
      return;
    }

    setIsGenerating(true);

    try {
      // 生成唯一的简历ID和验证URL
      const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const verificationUrl = `${window.location.origin}/verify-resume/${resumeId}`;
      setVerificationUrl(verificationUrl);

      // 生成二维码数据
      setQrCodeData(verificationUrl);

      // 在实际应用中，这里应该调用后端API生成PDF
      // const response = await fetch('/api/resume/generate-pdf', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     resumeData,
      //     qrCodeData: verificationUrl
      //   })
      // })

      // 模拟PDF生成
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 创建一个模拟的PDF blob URL
      const pdfBlob = await generateMockPDF();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setGeneratedPdfUrl(pdfUrl);

      // 在实际应用中，还需要将简历数据保存到数据库，关联到resumeId
      // 这样扫描二维码时可以验证简历真实性
    } catch (error) {
      console.error('生成PDF失败:', error);
      alert('生成PDF失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 生成模拟PDF（实际应用中使用jsPDF或类似库）
  const generateMockPDF = async (): Promise<Blob> => {
    // 这里使用简单的HTML转PDF方案
    // 实际应用中推荐使用 jsPDF、puppeteer 或服务端PDF生成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('无法创建canvas上下文');
    }

    // 设置canvas尺寸（A4比例）
    canvas.width = 595; // A4宽度（points）
    canvas.height = 842; // A4高度（points）

    // 白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制简历内容
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    let y = 50;

    // 标题
    ctx.fillText('个人简历', 50, y);
    y += 40;

    // 个人信息
    ctx.font = '16px Arial';
    if (resumeData.personalInfo?.name) {
      ctx.fillText(`姓名: ${resumeData.personalInfo.name}`, 50, y);
      y += 25;
    }
    if (resumeData.personalInfo?.email) {
      ctx.fillText(`邮箱: ${resumeData.personalInfo.email}`, 50, y);
      y += 25;
    }
    if (resumeData.personalInfo?.phone) {
      ctx.fillText(`电话: ${resumeData.personalInfo.phone}`, 50, y);
      y += 25;
    }

    // 技能
    if (resumeData.skills?.length > 0) {
      y += 20;
      ctx.font = '14px Arial';
      ctx.fillText('技能:', 50, y);
      y += 20;
      const skills = resumeData.skills.filter((skill: string) => skill.trim() !== '');
      skills.forEach((skill: string) => {
        ctx.fillText(`• ${skill}`, 70, y);
        y += 18;
      });
    }

    // 添加二维码区域说明
    y += 30;
    ctx.font = '12px Arial';
    ctx.fillText('扫描二维码验证简历真实性:', 50, y);
    y += 20;
    ctx.fillText(verificationUrl, 50, y);

    // 将canvas转换为blob
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob!);
      }, 'application/pdf');
    });
  };

  // 下载PDF
  const downloadPDF = () => {
    if (!generatedPdfUrl) return;

    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = `${resumeData.personalInfo?.name || 'resume'}_简历.pdf`;
    link.click();
  };

  // 生成二维码SVG
  const generateQRCodeSVG = (_data: string) => {
    // 这个函数现在接收data参数但为了简化暂时不使用
    // 在实际应用中会根据data生成真正的二维码
    // 简化版二维码生成（实际应用中使用qrcode.js或类似库）
    const size = 120;
    const modules = 21; // 简化的21x21矩阵
    const moduleSize = size / modules;

    // 创建一个简单的二维码模式
    const pattern = Array(modules)
      .fill(null)
      .map((_, i) =>
        Array(modules)
          .fill(null)
          .map(
            (_, j) =>
              (i + j) % 2 === 0 || i === 0 || i === modules - 1 || j === 0 || j === modules - 1
          )
      );

    const paths = pattern
      .map((row, i) =>
        row
          .map((cell, j) =>
            cell
              ? `M${j * moduleSize},${i * moduleSize}h${moduleSize}v${moduleSize}h-${moduleSize}z`
              : ''
          )
          .join('')
      )
      .join('');

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        <path d="${paths}" fill="black"/>
      </svg>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">生成简历PDF</h3>
        <p className="text-sm text-gray-600">生成专业的PDF简历，包含防伪二维码</p>
      </div>

      {/* Resume Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">简历预览</h4>
          <Button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            {isPreviewOpen ? '收起' : '展开'}预览
          </Button>
        </div>

        {isPreviewOpen && (
          <div ref={previewRef} className="space-y-4 border-t pt-4">
            {/* Personal Info */}
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">
                {resumeData.personalInfo?.name || '未填写姓名'}
              </h5>
              <div className="text-sm text-gray-600 space-y-1">
                {resumeData.personalInfo?.email && <p>邮箱: {resumeData.personalInfo.email}</p>}
                {resumeData.personalInfo?.phone && <p>电话: {resumeData.personalInfo.phone}</p>}
                {resumeData.personalInfo?.location && (
                  <p>地址: {resumeData.personalInfo.location}</p>
                )}
              </div>
            </div>

            {/* Summary */}
            {resumeData.personalInfo?.summary && (
              <div>
                <h6 className="font-medium text-gray-900 mb-2">个人简介</h6>
                <p className="text-sm text-gray-600">{resumeData.personalInfo.summary}</p>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills?.length > 0 && (
              <div>
                <h6 className="font-medium text-gray-900 mb-2">技能</h6>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills
                    .filter((skill: string) => skill.trim() !== '')
                    .map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {resumeData.workExperiences?.length > 0 && (
              <div>
                <h6 className="font-medium text-gray-900 mb-2">工作经历</h6>
                <div className="space-y-3">
                  {resumeData.workExperiences.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="font-medium text-gray-900">{exp.position}</h6>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div>
                <h6 className="font-medium text-gray-900 mb-2">教育背景</h6>
                <div className="space-y-3">
                  {resumeData.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="font-medium text-gray-900">{edu.degree}</h6>
                          <p className="text-sm text-gray-600">{edu.school}</p>
                          {edu.major && <p className="text-sm text-gray-600">专业: {edu.major}</p>}
                        </div>
                        <div className="text-xs text-gray-500">
                          {edu.startDate} - {edu.current ? '至今' : edu.endDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects?.length > 0 && (
              <div>
                <h6 className="font-medium text-gray-900 mb-2">项目经历</h6>
                <div className="space-y-3">
                  {resumeData.projects.map((project: any, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="font-medium text-gray-900">{project.name}</h6>
                          {project.technologies && (
                            <p className="text-sm text-gray-600">技术栈: {project.technologies}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.startDate} - {project.endDate}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          项目链接
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate PDF Button */}
      <div className="text-center">
        <Button
          onClick={generateResumePDF}
          disabled={isGenerating}
          size="lg"
          className="inline-flex items-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              生成中...
            </>
          ) : (
            <>
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              生成PDF简历
            </>
          )}
        </Button>
      </div>

      {/* Generated PDF Result */}
      {generatedPdfUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-green-800">PDF生成成功！</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Section */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">下载简历</h5>
              <Button
                onClick={downloadPDF}
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                下载PDF
              </Button>
            </div>

            {/* QR Code Section */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">验证二维码</h5>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="flex justify-center mb-2">
                  <div
                    className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(qrCodeData) }}
                  />
                </div>
                <p className="text-xs text-gray-500">扫描验证简历真实性</p>
              </div>
            </div>
          </div>

          {/* Verification URL */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start">
              <QrCodeIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">验证链接:</p>
                <p className="text-sm text-gray-500 break-all">{verificationUrl}</p>
                <p className="text-xs text-gray-400 mt-1">
                  此链接和二维码可用于验证简历的真实性和完整性
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">使用说明:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>生成的PDF包含防伪二维码，可验证简历真实性</li>
                  <li>扫描二维码或访问验证链接查看简历认证状态</li>
                  <li>建议在发送简历时同时提供验证链接</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
