'use client';

// https://dev.primuslabs.xyz/myDevelopment/myTemplates/detail?templateId=38396d71-242d-49da-a1aa-0affc3f70e19&name=Degree%20Information

import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk';
import { Shield, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface DigreeZktlsProps {
  isVerified?: boolean;
  onVerificationChange?: (verified: boolean) => void;
  name?: string; // 添加姓名参数用于验证
  errorMessage?: string; // 错误原因
  onErrorMessageChange?: (error: string) => void; // 更新错误原因的方法
}

interface PrimusRequest {
  setAttMode: (config: { algorithmType: string }) => void;
  toJsonString: () => string;
}

// 学信网数据结构（根据实际返回数据调整）
interface DegreeData {
  name?: string; // 姓名
  xm?: string; // 姓名（可能的字段名）
  studentName?: string; // 学生姓名
  // 添加其他可能的姓名字段...
  [key: string]: any; // 允许其他字段
}

interface AttestationData {
  data: string;
}

// interface Attestation {
//   data?: string;
// }

export default function DegreeZktlsComponent({
  isVerified = false,
  onVerificationChange,
  name,
  errorMessage,
  onErrorMessageChange,
}: DigreeZktlsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const primusProof = async (): Promise<void> => {
    // 检查是否提供了姓名
    if (!name || name.trim() === '') {
      const errorMsg = '请先填写姓名后再进行验证';
      if (onErrorMessageChange) {
        onErrorMessageChange(errorMsg);
      }
      alert(errorMsg);
      return;
    }

    // 清除之前的错误信息
    if (onErrorMessageChange) {
      onErrorMessageChange('');
    }

    setIsLoading(true);
    try {
      // Initialize parameters
      const primusZKTLS = new PrimusZKTLS();
      const appId = process.env.NEXT_PUBLIC_PRIMUS_APP_ID || '';
      const appSecret = process.env.NEXT_PUBLIC_PRIMUS_SECRET || '';

      await primusZKTLS.init(appId, appSecret);
      // console.log("primusProof initAttestaionResult=", initAttestaionResult);

      // Set TemplateID and user address
      const attTemplateID = process.env.NEXT_PUBLIC_PRIMUS_DIGREE_TEMPLATE_ID || '';
      const userAddress = process.env.NEXT_PUBLIC_PRIMUS_USER_ADDRESS || '';

      // Generate attestation request
      const request: PrimusRequest = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

      // Set zkTLS mode
      const workMode = 'proxytls';
      request.setAttMode({
        algorithmType: workMode,
      });

      // Transfer request object to string
      const requestStr = request.toJsonString();

      // Sign request
      const signedRequestStr = await primusZKTLS.sign(requestStr);

      // 这里就是获取到的数据和值
      const attestation = await primusZKTLS.startAttestation(signedRequestStr);
      // console.log("attestation=", attestation);

      // Parse and process attestation data for name verification
      let nameMatches = true;
      if (name && attestation && typeof attestation.data === 'string') {
        try {
          const attestationDataObj: AttestationData = JSON.parse(attestation.data);

          // 解析学信网数据
          if (attestationDataObj && typeof attestationDataObj.data === 'string') {
            try {
              const degreeDataObj: DegreeData = JSON.parse(attestationDataObj.data);
              // console.log('学信网数据：', degreeDataObj);

              // 尝试多个可能的姓名字段
              const possibleNameFields = ['name', 'xm', 'studentName', 'userName'];
              let degreeRecordName = '';

              for (const field of possibleNameFields) {
                if (degreeDataObj[field]) {
                  degreeRecordName = degreeDataObj[field];
                  break;
                }
              }

              if (degreeRecordName) {
                // 去除空格并转换为小写进行比较
                const inputName = name.trim().toLowerCase();
                const recordName = degreeRecordName.trim().toLowerCase();
                nameMatches = inputName === recordName;

                // console.log('学信网姓名验证:', {
                //   输入姓名: name,
                //   学信网记录姓名: degreeRecordName,
                //   是否匹配: nameMatches
                // });
              } else {
                console.warn('学信网数据中未找到姓名字段');
                nameMatches = false;
                const errorMsg = '学信网数据中未找到姓名字段，无法验证身份';
                if (onErrorMessageChange) {
                  onErrorMessageChange(errorMsg);
                }
              }
            } catch (e) {
              console.error('学信网数据解析失败：', e);
            }
          }
        } catch (e) {
          console.error('attestation.data 解析失败：', e);
        }
      }

      // Verify signature
      const verifyResult = primusZKTLS.verifyAttestation(attestation);
      // console.log("verifyResult=", verifyResult);

      // 验证成功需要同时满足：签名验证通过 && 姓名匹配（如果提供了姓名）
      const finalResult = verifyResult === true && nameMatches;

      // 设置错误信息或清除错误信息
      if (!finalResult && onErrorMessageChange) {
        if (!verifyResult) {
          onErrorMessageChange('学信网验证签名校验失败');
        } else if (!nameMatches && name) {
          // 检查是否已经设置了姓名相关的错误信息
          const existingError = errorMessage || '';
          if (!existingError.includes('姓名') && !existingError.includes('未找到姓名字段')) {
            onErrorMessageChange('姓名验证失败：输入姓名与学信网记录不符');
          }
        }
      } else if (finalResult && onErrorMessageChange) {
        onErrorMessageChange(''); // 验证成功，清除错误信息
      }

      // 通过回调函数通知父组件验证结果
      if (onVerificationChange) {
        onVerificationChange(finalResult);
      }
    } catch (error) {
      console.error('ZKTLS验证过程出错:', error);

      // 设置错误信息
      if (onErrorMessageChange) {
        onErrorMessageChange(
          `验证过程出错: ${error instanceof Error ? error.message : '未知错误'}`
        );
      }

      // 验证失败时通知父组件
      if (onVerificationChange) {
        onVerificationChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={primusProof}
      disabled={isLoading || isVerified}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
        isVerified
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isVerified ? (
          <CheckCircle className="w-4 h-4 text-blue-200" />
        ) : (
          <Shield className="w-4 h-4 group-hover:rotate-6 transition-transform duration-200" />
        )}
        <span className="relative">
          {isLoading ? '验证中...' : isVerified ? '已验证' : '学信网验证'}
        </span>
        {!isLoading && !isVerified && (
          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </div>

      {/* 装饰性光效 */}
      {!isVerified && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}

      {/* 验证成功状态指示器 */}
      {isVerified && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full">
          <div className="w-full h-full bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* 学历图标装饰 - 仅在未验证时悬停显示 */}
      {!isVerified && (
        <div className="absolute -top-1 -left-1 text-blue-300 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="text-xs">🎓</div>
        </div>
      )}

      {/* 验证成功装饰 */}
      {isVerified && (
        <div className="absolute -top-1 -left-1 text-blue-300">
          <div className="text-xs">🎓</div>
        </div>
      )}
    </button>
  );
}
