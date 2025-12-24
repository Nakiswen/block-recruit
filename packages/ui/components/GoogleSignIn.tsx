'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Button from './Button';

interface GoogleSignInProps {
  onSignIn?: (user: any) => void;
  onSignOut?: () => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSignIn, onSignOut }) => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // 当用户登录成功时，通知外部组件
  React.useEffect(() => {
    if (session?.user && onSignIn) {
      onSignIn(session.user);
    }
  }, [session, onSignIn]);

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    if (onSignOut) {
      onSignOut();
    }
  };

  // 格式化邮箱显示
  const formatEmail = (email: string) => {
    if (!email) return '';
    if (email.length <= 20) return email;
    const [localPart, domain] = email.split('@');
    if (localPart.length > 10) {
      return `${localPart.slice(0, 8)}...@${domain}`;
    }
    return email;
  };

  if (isLoading) {
    return (
      <Button variant="primary" size="sm" disabled className="flex items-center">
        <UserCircleIcon className="h-5 w-5 mr-2" />
        加载中...
      </Button>
    );
  }

  if (!session) {
    return (
      <Button variant="primary" size="sm" onClick={handleSignIn} className="flex items-center">
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        使用 Google 登录
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      {session.user?.image && (
        <img src={session.user.image} alt="User avatar" className="h-8 w-8 rounded-full mr-2" />
      )}
      <span className="text-sm font-medium text-gray-700 mr-3">
        {session.user?.email ? formatEmail(session.user.email) : session.user?.name}
      </span>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        登出
      </Button>
    </div>
  );
};

export default React.memo(GoogleSignIn);
