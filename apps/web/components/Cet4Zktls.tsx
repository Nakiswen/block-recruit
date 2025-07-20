'use client';

// https://dev.primuslabs.xyz/myDevelopment/myTemplates/detail?templateId=80af9bc9-af78-4186-82da-29554a31cbe2&name=CET-4/CET-6%20Score

import { PrimusZKTLS } from '@primuslabs/zktls-js-sdk';
import { Shield, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Cet4ZktlsProps {
  isVerified?: boolean;
  onVerificationChange?: (verified: boolean) => void;
  name?: string; // 添加姓名参数用于验证
  errorMessage?: string; // 错误原因
  onErrorMessageChange?: (error: string) => void; // 更新错误原因的方法
}

interface CETExamRecord {
  xm: string;
  sfz: string;
  xx: string;
  zkzh: string;
  score: string;
  zsbh: string;
  subject: string;
  exam_id: string;
  exam: string;
  tab: string;
  bkjb_code: string;
  is_down: number;
}

interface CETData {
  xm: string;
  sfz: string;
  list: CETExamRecord[];
  total: number;
}

interface AttestationData {
  data: string;
}

interface PrimusRequest {
  setAttMode: (config: { algorithmType: string }) => void;
  toJsonString: () => string;
}

interface Attestation {
  data?: string;
}

export default function Cet4ZktlsComponent({
  isVerified = false,
  onVerificationChange,
  name,
  onErrorMessageChange,
}: Cet4ZktlsProps) {
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
      // console.log('primusProof initAttestaionResult=', initAttestaionResult);

      // Set TemplateID and user address
      const attTemplateID = process.env.NEXT_PUBLIC_PRIMUS_CET_TEMPLATE_ID || '';
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

      // 这里就是获取到四六级网站返回的数据，数据格式如下：
      const attestation: Attestation = await primusZKTLS.startAttestation(signedRequestStr);

      // Parse and process attestation data
      if (attestation && typeof attestation.data === 'string') {
        try {
          const attestationDataObj: AttestationData = JSON.parse(attestation.data);

          // 解析 attestationDataObj.data 字符串为对象
          if (attestationDataObj && typeof attestationDataObj.data === 'string') {
            try {
              const cetDataObj: CETData = JSON.parse(attestationDataObj.data);
              // console.log('CET4 数据：', cetDataObj);

              // 验证姓名是否匹配
              let nameMatches = true;
              if (name && cetDataObj.xm) {
                // 去除空格并转换为小写进行比较
                const inputName = name.trim().toLowerCase();
                const cetName = cetDataObj.xm.trim().toLowerCase();
                nameMatches = inputName === cetName;

                // console.log('姓名验证:', {
                //   输入姓名: name,
                //   CET记录姓名: cetDataObj.xm,
                //   是否匹配: nameMatches
                // });
              }

              // Process CET data here if needed
              if (cetDataObj.list && cetDataObj.list.length > 0) {
                // console.log('CET考试记录：', cetDataObj.list);
              }

              // 如果姓名不匹配，验证失败
              if (!nameMatches) {
                const errorMsg = `姓名验证失败：输入姓名"${name}"与CET记录"${cetDataObj.xm}"不符`;
                console.error(errorMsg);
                if (onErrorMessageChange) {
                  onErrorMessageChange(errorMsg);
                }
                if (onVerificationChange) {
                  onVerificationChange(false);
                }
                return;
              }
            } catch (e) {
              console.error('CET4 data 字段解析失败：', e);
            }
          }
        } catch (e) {
          console.error('attestation.data 解析失败：', e);
        }
      }

      // Verify signature
      const verifyResult = primusZKTLS.verifyAttestation(attestation);
      // console.log('verifyResult=', verifyResult);

      // 验证成功需要同时满足：签名验证通过 && 姓名匹配（如果提供了姓名）
      let finalResult = verifyResult === true;

      // 如果提供了姓名，需要重新检查姓名匹配情况
      if (name && attestation && typeof attestation.data === 'string') {
        try {
          const attestationDataObj: AttestationData = JSON.parse(attestation.data);
          if (attestationDataObj && typeof attestationDataObj.data === 'string') {
            const cetDataObj: CETData = JSON.parse(attestationDataObj.data);
            if (cetDataObj.xm) {
              const inputName = name.trim().toLowerCase();
              const cetName = cetDataObj.xm.trim().toLowerCase();
              const nameMatches = inputName === cetName;
              finalResult = finalResult && nameMatches;
            }
          }
        } catch (e) {
          console.error('最终验证时解析数据失败:', e);
          finalResult = false;
        }
      }

      // 设置错误信息或清除错误信息
      if (!finalResult && onErrorMessageChange) {
        if (!verifyResult) {
          onErrorMessageChange('CET验证签名校验失败');
        }
        // 姓名不匹配的错误信息已在前面设置
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
          ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white'
          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isVerified ? (
          <CheckCircle className="w-4 h-4 text-green-200" />
        ) : (
          <Shield className="w-4 h-4 group-hover:rotate-6 transition-transform duration-200" />
        )}
        <span className="relative">
          {isLoading ? '验证中...' : isVerified ? '已验证' : 'CET 4/6 级验证'}
        </span>
        {!isLoading && !isVerified && (
          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </div>

      {/* 装饰性光效 */}
      {!isVerified && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}

      {/* 验证成功状态指示器 */}
      {isVerified && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full">
          <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* 奖杯图标装饰 - 仅在未验证时悬停显示 */}
      {!isVerified && (
        <div className="absolute -top-1 -left-1 text-yellow-300 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="text-xs">🏆</div>
        </div>
      )}

      {/* 验证成功装饰 */}
      {isVerified && (
        <div className="absolute -top-1 -left-1 text-green-300">
          <div className="text-xs">🏆</div>
        </div>
      )}
    </button>
  );
}
