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
import { Manrope, Space_Grotesk } from 'next/font/google';

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

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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
  const displayRangeStart = totalJobs === 0 ? 0 : (currentPage - 1) * pageSize.value + 1;
  const displayRangeEnd = totalJobs === 0 ? 0 : Math.min(currentPage * pageSize.value, totalJobs);

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
    <div className={`min-h-screen ${bodyFont.className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[-6rem] h-80 w-80 rounded-full bg-teal-200/50 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8">
        <header className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
          <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr,1fr]">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-700/80">
                Web3 Jobs
              </p>
              <h1
                className={`mt-2 text-xl font-semibold text-slate-900 sm:text-2xl ${displayFont.className}`}
              >
                精准匹配 · 高效招募
              </h1>
              <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                汇集 <span className="font-semibold text-slate-900">{totalJobs}</span> 个优质岗位，
                支持关键词搜索与分页查看。
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  onClick={() => router.push('/recruit')}
                  className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  新增岗位
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                >
                  返回主页
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-inner">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Filter
              </p>
              <div className="mt-3 space-y-3">
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                    placeholder="搜索岗位/公司/地点"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  {searchInput ? (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="清空搜索"
                    >
                      <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  当前显示第{' '}
                  <span className="font-semibold text-slate-900">{displayRangeStart}</span> 到{' '}
                  <span className="font-semibold text-slate-900">{displayRangeEnd}</span> 条
                </div>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="relative z-20 mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Live
            </span>
            <span className="text-slate-700">
              关键词:{' '}
              <span className="font-semibold text-slate-900">{searchKeyword || '全部'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              每页
            </span>
            <Listbox value={pageSize} onChange={handlePageSizeChange}>
              <div className="relative z-30">
                <Listbox.Button className="relative cursor-pointer rounded-full bg-white py-1.5 pl-3 pr-9 text-left text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  <span className="block truncate">{pageSize.label}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute right-0 z-50 mt-2 max-h-60 w-32 overflow-auto rounded-2xl bg-white py-1 text-xs shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {pageSizeOptions.map(option => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-emerald-50 text-emerald-900' : 'text-slate-900'
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
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
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
        </section>

        <main className="relative z-0 mt-6 grid gap-5">
          {isLoading ? (
            <div className="grid gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm"
                >
                  <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                  <div className="mt-2.5 h-3 w-1/3 rounded-full bg-slate-200" />
                  <div className="mt-4 h-9 w-full rounded-2xl bg-slate-100" />
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {jobs.map((job, index) => {
                const jobKey = job.id || `${job.title}-${index}`;
                const isExpanded = expandedState[jobKey] || false;

                return (
                  <article
                    key={jobKey}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur animate-rise"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-slate-400 to-sky-400 opacity-60" />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3
                          className={`text-lg font-semibold text-slate-900 ${displayFont.className}`}
                        >
                          {job.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-600">
                          {job.companyName || job.company}
                          {job.location ? ` · ${job.location}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
                          {job.salary || '薪资面议'}
                        </span>
                        {job.similarity ? (
                          <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[0.65rem] font-semibold text-white">
                            匹配度 {Math.round(job.similarity * 100)}%
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem] font-medium text-slate-600">
                      {job.location ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                          {job.location}
                        </span>
                      ) : null}
                      {(job.companyName || job.company) && (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                          {job.companyName || job.company}
                        </span>
                      )}
                      {job.companyWebsite ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                          官网可查
                        </span>
                      ) : null}
                      {job.benefits ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                          福利亮点
                        </span>
                      ) : null}
                    </div>

                    {isExpanded && (
                      <div className="mt-5 space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 animate-fadeIn">
                        {job.companyIntroduction && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">公司介绍</h4>
                            <div className="prose prose-slate mt-2 max-w-none text-xs">
                              <ReactMarkdown>{job.companyIntroduction}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {job.description && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">职位描述</h4>
                            <div className="prose prose-slate mt-2 max-w-none text-xs">
                              <ReactMarkdown>{job.description}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {job.requirements && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">岗位要求</h4>
                            <div className="prose prose-slate mt-2 max-w-none text-xs">
                              <ReactMarkdown>{job.requirements}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {job.responsibilities && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">工作职责</h4>
                            <div className="prose prose-slate mt-2 max-w-none text-xs">
                              <ReactMarkdown>{job.responsibilities}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {job.benefits && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">福利待遇</h4>
                            <div className="prose prose-slate mt-2 max-w-none text-xs">
                              <ReactMarkdown>{job.benefits}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {job.companyWebsite && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">公司网站</h4>
                            <a
                              href={job.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-600"
                            >
                              {job.companyWebsite}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-3.5">
                      <button
                        className="text-xs font-semibold text-slate-800 transition hover:text-slate-900"
                        onClick={() => toggleJobExpanded(jobKey)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? '收起详情' : '查看详情'}
                      >
                        {isExpanded ? '收起详情' : '查看详情'}
                        <span
                          className={`ml-1 inline-block transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          ↓
                        </span>
                      </button>
                      {job.companyWebsite ? (
                        <a
                          href={job.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-slate-300 px-3.5 py-1.5 text-[0.65rem] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          访问官网
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/70 bg-white/70 px-6 py-16 text-center shadow-sm">
              <p className={`text-2xl font-semibold text-slate-900 ${displayFont.className}`}>
                暂无岗位数据
              </p>
              <p className="mt-2 text-sm text-slate-600">可以先新增一个岗位或调整搜索条件。</p>
            </div>
          )}
        </main>

        {jobs.length > 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600">
                显示第 <span className="font-semibold text-slate-900">{displayRangeStart}</span> 到{' '}
                <span className="font-semibold text-slate-900">{displayRangeEnd}</span> 条,共{' '}
                <span className="font-semibold text-slate-900">{totalJobs}</span> 条
              </p>

              <nav className="isolate inline-flex -space-x-px rounded-full" aria-label="Pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-full px-3 py-1.5 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">上一页</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-500 ring-1 ring-inset ring-slate-200"
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
                      className={`relative inline-flex items-center px-3.5 py-1.5 text-xs font-semibold ${
                        isCurrent
                          ? 'z-10 bg-slate-900 text-white ring-1 ring-slate-900'
                          : 'text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-full px-3 py-1.5 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">下一页</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes rise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.35s ease-out;
          }
          .animate-rise {
            animation: rise 0.45s ease-out both;
          }
        `,
        }}
      />
    </div>
  );
}
