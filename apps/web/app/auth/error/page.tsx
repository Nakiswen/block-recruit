'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'Google OAuth 配置错误，请检查 GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET',
    AccessDenied: '您拒绝了访问权限',
    Verification: '验证令牌已过期或已被使用',
    OAuthSignin:
      'OAuth 登录失败：无法连接到 Google 服务器，可能是网络代理或 Client ID/Secret 配置错误',
    OAuthCallback: 'OAuth 回调失败：请检查 Google Cloud Console 中的重定向 URI 配置',
    OAuthCreateAccount: '创建账户失败',
    EmailCreateAccount: '邮箱账户创建失败',
    Callback: '回调 URL 处理失败',
    OAuthAccountNotLinked: '此邮箱已与其他登录方式关联',
    EmailSignin: '邮箱登录失败',
    CredentialsSignin: '凭据登录失败：用户名或密码错误',
    SessionRequired: '需要登录才能访问此页面',
    Default: '发生了未知错误',
  };

  const errorMessage = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">登录失败</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          {error && (
            <div className="bg-gray-100 rounded p-4 mb-6 text-left">
              <p className="text-sm text-gray-700">
                <strong>错误代码:</strong> {error}
              </p>
            </div>
          )}
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">加载中...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
