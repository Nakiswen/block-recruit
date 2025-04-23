'use client';

import React, { useCallback, useMemo } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnect from './WalletConnect';

interface NavigationItem {
  name: string;
  href: string;
}

interface NavigationProps {
  logo?: React.ReactNode;
  items?: NavigationItem[];
  walletConnectEnabled?: boolean;
  onConnect?: () => void;
  isConnected?: boolean;
  walletAddress?: string;
  onDisconnect?: () => void;
}

const defaultItems = [
  { name: '首页', href: '/' },
  { name: '简历筛选', href: '/resume-screening' },
  { name: '面试官', href: '/interview' },
  { name: '关于我们', href: '/about' },
];

const Navigation: React.FC<NavigationProps> = ({
  logo,
  items = defaultItems,
  walletConnectEnabled = true,
  onConnect,
  isConnected = false,
  walletAddress = '',
  onDisconnect,
}) => {
  const pathname = usePathname();
  
  // 使用useMemo缓存不变的内容
  const logoElement = useMemo(() => (
    logo || (
      <Link href="/" className="text-xl font-bold">
        <span className="gradient-text">BlockRecruit</span>
      </Link>
    )
  ), [logo]);

  // 优化渲染效率和减少内存使用
  const renderNavItems = useCallback((item: NavigationItem) => {
    const isCurrent = pathname === item.href;
    
    return (
      <Link
        key={item.name}
        href={item.href}
        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
          isCurrent
            ? 'border-primary-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {item.name}
      </Link>
    );
  }, [pathname]);

  const renderMobileNavItems = useCallback((item: NavigationItem) => {
    const isCurrent = pathname === item.href;
    
    return (
      <Disclosure.Button
        key={item.name}
        as="div"
        className="block"
      >
        <Link
          href={item.href}
          className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
            isCurrent
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          }`}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {item.name}
        </Link>
      </Disclosure.Button>
    );
  }, [pathname]);

  return (
    <Disclosure as="nav" className="bg-white shadow-md backdrop-blur-sm bg-opacity-80 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  {logoElement}
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  {items.map(renderNavItems)}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {walletConnectEnabled && (
                  <WalletConnect
                    onConnect={onConnect}
                    isConnected={isConnected}
                    walletAddress={walletAddress}
                    onDisconnect={onDisconnect}
                  />
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">打开主菜单</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {items.map(renderMobileNavItems)}
              {walletConnectEnabled && (
                <div className="mt-4 px-4">
                  <WalletConnect
                    onConnect={onConnect}
                    isConnected={isConnected}
                    walletAddress={walletAddress}
                    onDisconnect={onDisconnect}
                  />
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

// 使用React.memo减少不必要的重渲染
export default React.memo(Navigation); 