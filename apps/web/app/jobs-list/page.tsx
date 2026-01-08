'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

import { jobServices } from '../../lib/api';
import { Job as BaseJob } from '../../services/api-client';

// 扩展 Job 类型
type Job = BaseJob & {
  similarity?: number;
  companyName?: string;
  companyIntroduction?: string;
  responsibilities?: string;
  benefits?: string;
  companyWebsite?: string;
};

// 每页显示数量选项
const pageSizeOptions = [
  { value: 10, label: '10 条/页' },
  { value: 20, label: '20 条/页' },
  { value: 50, label: '50 条/页' },
];

/**
 * 岗位列表页面
 * 展示数据库中所有的岗位,支持分页
 */
export default function JobsListPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});

  const [manualOnly] = useState(true);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [totalJobs, setTotalJobs] = useState(0);

  // 搜索状态
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 计算总页数
  const totalPages = Math.ceil(totalJobs / pageSize.value);

  // 搜索输入防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      setSearchKeyword(trimmed);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 获取岗位数据
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 调用API获取岗位数据
        const allJobs = await jobServices.getJobs({
          page: currentPage,
          pageSize: pageSize.value,
          manualOnly,
          ...(searchKeyword ? { keyword: searchKeyword } : {}),
        });

        setJobs(allJobs.jobs as Job[]);
        setTotalJobs(allJobs.total); // 实际应该从API返回总数
      } catch (err) {
        console.error('获取岗位数据失败:', err);
        setError('获取岗位数据失败,请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, pageSize, searchKeyword, manualOnly]);

  // 切换岗位详情展开/收起
  const toggleJobExpanded = (jobId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // 切换页码
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 改变每页显示数量
  const handlePageSizeChange = (newPageSize: (typeof pageSizeOptions)[0]) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置到第一页
  };

  // 生成页码数组
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // 总页数少,显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数多,显示部分页码
      if (currentPage <= 4) {
        // 当前页靠前
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 当前页靠后
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto" style={{ height: 'calc(100vh - 180px)' }}>
      {/* 顶部栏 - 固定高度 */}
      <div className="flex-shrink-0 flex justify-between items-center px-3 py-3 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">岗位列表</h1>
          <p className="text-xs text-gray-600 mt-0.5">共 {totalJobs} 个岗位</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <label className="flex items-center gap-1.5 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={manualOnly}
              onChange={event => {
                setManualOnly(event.target.checked);
                setCurrentPage(1);
              }}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            仅人工
          </label> */}
          <div className="relative">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="搜索岗位/公司/地点"
              className="w-56 rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-7 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="清空搜索"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <button
            onClick={() => router.push('/recruit')}
            className="px-2.5 py-1.5 text-xs font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
          >
            新增岗位
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            返回主页
          </button>
        </div>
      </div>

      {/* 错误提示 - 固定在顶部 */}
      {error && (
        <div className="flex-shrink-0 bg-red-100 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-4 rounded-md">
          {error}
        </div>
      )}

      {/* 岗位列表区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map(job => {
              const isExpanded = expandedState[job.id || ''] || false;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <span className="text-blue-600 font-medium">{job.salary}</span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {job.companyName || job.company} · {job.location}
                      </p>
                    </div>
                  </div>

                  {/* 展开后显示详细描述 */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-fadeIn">
                      {/* 公司介绍 */}
                      {job.companyIntroduction && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">公司介绍</h4>
                          <div className="prose text-gray-700 max-w-none">
                            <ReactMarkdown>{job.companyIntroduction}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* 职位描述 */}
                      {job.description && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">职位描述</h4>
                          <div className="prose text-gray-700 max-w-none">
                            <ReactMarkdown>{job.description}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* 岗位要求 */}
                      {job.requirements && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">岗位要求</h4>
                          <div className="prose text-gray-700 max-w-none">
                            <ReactMarkdown>{job.requirements}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* 职责 */}
                      {job.responsibilities && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">工作职责</h4>
                          <div className="prose text-gray-700 max-w-none">
                            <ReactMarkdown>{job.responsibilities}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* 福利待遇 */}
                      {job.benefits && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">福利待遇</h4>
                          <div className="prose text-gray-700 max-w-none">
                            <ReactMarkdown>{job.benefits}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* 公司网站 */}
                      {job.companyWebsite && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">公司网站</h4>
                          <a
                            href={job.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {job.companyWebsite}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      onClick={() => toggleJobExpanded(job.id || '')}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? '收起详情' : '查看详情'}
                    >
                      {isExpanded ? '收起详情' : '查看详情'}
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">暂无岗位数据</p>
          </div>
        )}
      </div>

      {/* 分页控制 - 固定在底部 */}
      {jobs.length > 0 && (
        <div className="flex-shrink-0 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 z-[999]">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                显示第 <span className="font-medium">{(currentPage - 1) * pageSize.value + 1}</span>{' '}
                到{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize.value, totalJobs)}
                </span>{' '}
                条,共 <span className="font-medium">{totalJobs}</span> 条
              </p>

              {/* 每页显示数量选择器 */}
              <Listbox value={pageSize} onChange={handlePageSizeChange}>
                <div className="relative">
                  <Listbox.Button className="relative cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="block truncate">{pageSize.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {pageSizeOptions.map(option => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                            }`
                          }
                          value={option}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                              >
                                {option.label}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* 分页按钮 */}
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {/* 上一页按钮 */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">上一页</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* 页码按钮 */}
                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNumber = page as number;
                  const isCurrent = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        isCurrent
                          ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* 下一页按钮 */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">下一页</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 动画样式 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `,
        }}
      />
    </div>
  );
}
