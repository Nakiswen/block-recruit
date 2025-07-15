'use client';

import { getAuthHeaders, connectWallet } from '@/packages/web3-utils/wallet';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function ResumePage() {
  const router = useRouter();
  const [step, setStep] = useState<'select-job' | 'upload-resume'>('select-job');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileContent, setFileContent] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);

  // 检查钱包连接状态
  const checkWalletConnection = useCallback(() => {
    if (typeof window !== 'undefined') {
      const walletAuth = localStorage.getItem('walletAuth');
      const walletAddress = localStorage.getItem('walletAuthAddress');
      setIsWalletConnected(!!(walletAuth && walletAddress));
    }
  }, []);

  // 监听localStorage变化，用于跨组件同步钱包状态
  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === 'walletAuth' || event.key === 'walletAuthAddress') {
        checkWalletConnection();
      }
    },
    [checkWalletConnection]
  );

  // 页面加载时获取岗位列表和检查钱包状态
  useEffect(() => {
    fetchJobs();
    checkWalletConnection();

    // 添加钱包状态变化监听
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkWalletConnection, handleStorageChange]);

  // 处理钱包连接
  const handleConnectWallet = useCallback(async () => {
    try {
      setConnectingWallet(true);
      setError('');
      const result = await connectWallet();
      if (result.error) {
        setError(`连接钱包失败: ${result.error}`);
      } else {
        setIsWalletConnected(true);
      }
    } catch (error) {
      setError('连接钱包时发生错误');
      console.error(error);
    } finally {
      setConnectingWallet(false);
    }
  }, []);

  // 获取岗位列表
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/job');
      const { success, data, error } = await response.json();

      if (!success) {
        throw new Error(error || '获取岗位列表失败');
      }

      setJobs(data);
    } catch (error) {
      setError('获取岗位列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 创建新岗位
  const createJob = async (formData: FormData) => {
    try {
      setLoading(true);

      // 再次检查钱包连接状态
      checkWalletConnection();

      // 检查钱包是否已连接
      if (!isWalletConnected) {
        setError('请先连接钱包以创建岗位');
        setLoading(false);
        return;
      }

      const jobData = {
        title: formData.get('title'),
        description: formData.get('description'),
        jobType: formData.get('jobType'),
        weights: {
          skills: Number(formData.get('skillWeight')),
          experience: Number(formData.get('experienceWeight')),
          web3: Number(formData.get('web3Weight')),
        },
      };

      // 获取认证头
      const authHeaders = getAuthHeaders();

      // 检查认证头是否存在
      if (!authHeaders.Authorization) {
        setError('无法获取钱包认证信息，请重新连接钱包');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders, // 添加认证头
        },
        body: JSON.stringify(jobData),
      });

      // 检查HTTP状态码
      if (response.status === 401) {
        setError('钱包认证失败，请重新连接钱包');
        setIsWalletConnected(false);
        setLoading(false);
        return;
      }

      const { success, data, error: responseError } = await response.json();

      if (!success) {
        throw new Error(responseError || '创建岗位失败');
      }

      setJobs([...jobs, data]);
      setSelectedJob(data);
      setStep('upload-resume');
    } catch (error: any) {
      // 处理401未授权错误
      if (error.message?.includes('401') || error.message?.includes('请先连接钱包')) {
        setError('请先连接钱包以创建岗位');
        setIsWalletConnected(false); // 重置连接状态
      } else {
        setError('创建岗位失败: ' + error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件上传
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 读取文件内容
      const content = await readFileAsText(file);
      setFileContent(content);
    } catch (error) {
      console.error('读取文件失败:', error);
      setError('读取文件失败');
    }
  };

  // 读取文件为文本
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target?.result as string);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
  };

  // 上传简历
  const handleSubmitResume = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob || !fileContent) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob.id);
      formData.append('content', fileContent);

      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('简历解析失败');
      }

      const { data } = await response.json();
      router.push(`/resume/${data.id}`);
    } catch (error) {
      setError('简历解析失败，请稍后重试');
      // 错误记录可以通过后端日志系统记录，而不是在客户端控制台
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">简历解析</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          {!isWalletConnected && (
            <button
              className="ml-4 underline text-blue-600 hover:text-blue-800"
              onClick={handleConnectWallet}
              disabled={connectingWallet}
            >
              {connectingWallet ? '连接中...' : '立即连接钱包'}
            </button>
          )}
        </div>
      )}

      {step === 'select-job' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            选择或创建岗位
            {!isWalletConnected && (
              <span className="text-sm font-normal text-red-500 ml-2">
                (创建岗位需要先
                <button
                  className="underline text-blue-600 hover:text-blue-800 mx-1"
                  onClick={handleConnectWallet}
                  disabled={connectingWallet}
                >
                  {connectingWallet ? '连接中...' : '连接钱包'}
                </button>
                )
              </span>
            )}
          </h2>

          {/* 岗位列表 */}
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {jobs.map(job => (
                <div
                  key={job.id}
                  className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedJob(job);
                    setStep('upload-resume');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedJob(job);
                      setStep('upload-resume');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.jobType}</p>
                </div>
              ))}
            </div>
          ) : loading ? (
            <p className="mb-8">加载岗位中...</p>
          ) : (
            <p className="mb-8">暂无岗位，请创建新岗位</p>
          )}

          {/* 创建新岗位表单 */}
          <form
            onSubmit={e => {
              e.preventDefault();
              createJob(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-4">
              <input
                name="title"
                placeholder="岗位标题"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="岗位描述"
                className="w-full p-2 border rounded"
                rows={5}
                required
              />
              <select name="jobType" className="w-full p-2 border rounded" required>
                <option value="">选择岗位类型</option>
                <option value="smart-contract">智能合约开发</option>
                <option value="blockchain-architect">区块链架构师</option>
                <option value="defi-pm">DeFi产品经理</option>
                <option value="web3-frontend">Web3前端开发</option>
                <option value="web3-backend">Web3后端开发</option>
              </select>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="skillWeight" className="block text-sm text-gray-600 mb-1">
                    技能权重
                  </label>
                  <input
                    id="skillWeight"
                    type="number"
                    name="skillWeight"
                    className="w-full p-2 border rounded"
                    min="1"
                    max="10"
                    defaultValue="5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="experienceWeight" className="block text-sm text-gray-600 mb-1">
                    经验权重
                  </label>
                  <input
                    id="experienceWeight"
                    type="number"
                    name="experienceWeight"
                    className="w-full p-2 border rounded"
                    min="1"
                    max="10"
                    defaultValue="5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="web3Weight" className="block text-sm text-gray-600 mb-1">
                    Web3权重
                  </label>
                  <input
                    id="web3Weight"
                    type="number"
                    name="web3Weight"
                    className="w-full p-2 border rounded"
                    min="1"
                    max="10"
                    defaultValue="5"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? '创建中...' : '创建岗位'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">上传简历 - {selectedJob?.title}</h2>

          <form onSubmit={handleSubmitResume}>
            <div className="mb-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="mb-2"
                onChange={handleFileChange}
                required
              />
              <p className="text-sm text-gray-500">支持PDF、DOC、DOCX、TXT格式</p>
            </div>

            {fileContent && (
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">文件预览（前200字符）:</h3>
                <p className="text-sm text-gray-600 break-words">
                  {fileContent.substring(0, 200)}
                  {fileContent.length > 200 ? '...' : ''}
                </p>
              </div>
            )}

            <div>
              <button
                type="button"
                className="mr-4 px-4 py-2 border rounded"
                onClick={() => setStep('select-job')}
              >
                返回
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={loading || !fileContent}
              >
                {loading ? '解析中...' : '开始解析'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
