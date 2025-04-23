import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from 'ui';
import { aiParserFunction, ResumeData } from 'resume-parser';

interface ResumeAIParserProps {
  file: File | null;
  onParseComplete?: (data: ResumeData) => void;
  onComplete?: (data: ResumeData) => void;
  onError: (error: string) => void;
}

/**
 * 简历AI解析组件
 * 处理简历文件的AI解析，并显示解析进度和状态
 */
const ResumeAIParser: React.FC<ResumeAIParserProps> = ({
  file,
  onParseComplete,
  onComplete,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  
  // 确定使用哪个回调函数
  const handleComplete = onComplete || onParseComplete;

  // 使用定时器模拟解析进度
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isProcessing && progress < 95) {
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 5 + 1;
          const newProgress = Math.min(prev + increment, 95);
          
          // 根据进度更新状态消息
          if (newProgress < 20) {
            setStatusMessage('初始化解析引擎...');
          } else if (newProgress < 40) {
            setStatusMessage('读取文件内容...');
          } else if (newProgress < 60) {
            setStatusMessage('提取简历结构...');
          } else if (newProgress < 80) {
            setStatusMessage('分析Web3相关技能和经验...');
          } else {
            setStatusMessage('完成解析，整合结果...');
          }
          
          return newProgress;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, progress]);

  // 处理AI解析
  const handleParse = useCallback(async () => {
    if (!file) {
      onError('请先上传简历文件');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setStatusMessage('初始化解析引擎...');

    try {
      const result = await aiParserFunction(file);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.data) {
        throw new Error('解析结果为空');
      }
      
      // 设置进度为100%并显示成功消息
      setProgress(100);
      setStatusMessage('解析成功!');
      
      // 短暂延迟后传递解析结果
      setTimeout(() => {
        if (handleComplete) {
          handleComplete(result.data);
        }
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      setStatusMessage('解析失败');
      setIsProcessing(false);
      onError(error instanceof Error ? error.message : '未知错误');
    }
  }, [file, handleComplete, onError]);

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 gradient-text">AI简历解析</h2>
      
      {!isProcessing ? (
        <div>
          <p className="mb-4 text-gray-700">
            使用AI技术解析简历，提取结构化信息并识别Web3相关技能和经验。
          </p>
          <Button onClick={handleParse} disabled={!file || isProcessing}>
            开始AI解析
          </Button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-center text-gray-700">{statusMessage}</p>
        </div>
      )}
    </Card>
  );
};

export default ResumeAIParser; 