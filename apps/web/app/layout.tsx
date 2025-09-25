'use client';

import './globals.css';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// 使用动态导入优化首屏加载性能
const Navigation = dynamic(() => import('ui').then(mod => mod.Navigation), {
  ssr: false,
  loading: () => <div className="h-16 bg-white shadow-md"></div>,
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [shootingStars, setShootingStars] = useState<
    Array<{ id: number; top: number; left: number; delay: number }>
  >([]);

  // 钱包连接状态
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // 创建随机流星效果
  useEffect(() => {
    const stars = [];
    const starCount = 5;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        id: i,
        top: Math.random() * 70, // 控制高度分布
        left: 30 + Math.random() * 50, // 控制水平分布
        delay: Math.random() * 15, // 随机延迟时间
      });
    }

    setShootingStars(stars);

    // 检查是否已经连接钱包 - 仅从本地存储读取，不发送请求
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('walletAuthAddress');
      const savedAuth = localStorage.getItem('walletAuth');
      if (savedAddress && savedAuth === 'true') {
        // 只设置本地状态，不发送网络请求
        setIsConnected(true);
        setWalletAddress(savedAddress);
      }
    }
  }, []);

  // 处理钱包连接
  const handleConnect = useCallback((address: string) => {
    setIsConnected(true);
    setWalletAddress(address);
  }, []);

  // 处理钱包断开连接
  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setWalletAddress('');
  }, []);

  return (
    <html lang="zh">
      <body className={`${inter.className} min-h-screen`}>
        <Navigation
          walletConnectEnabled={true}
          onConnect={handleConnect}
          isConnected={isConnected}
          walletAddress={walletAddress}
          onDisconnect={handleDisconnect}
          showMenu={false}
        />
        <main className="container mx-auto px-4 pb-24">
          {/* 装饰元素 */}
          <div className="decoration-wrapper">
            {/* 流星效果 */}
            {shootingStars.map(star => (
              <div
                key={star.id}
                className="shooting-star"
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}

            {/* 渐变球效果 */}
            <div className="gradient-orb gradient-orb-1"></div>
            <div className="gradient-orb gradient-orb-2"></div>
            <div className="gradient-orb gradient-orb-3"></div>

            {/* 几何图形元素 */}
            <div className="geo-shape geo-circle"></div>
            <div className="geo-shape geo-square"></div>
            <div className="geo-shape geo-triangle"></div>
            <div className="geo-shape geo-ring"></div>
            <div className="geo-shape geo-dots">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="geo-dot"></div>
              ))}
            </div>
          </div>

          <TransitionGroup>
            <CSSTransition key={pathname} timeout={300} classNames="page-transition" unmountOnExit>
              <div className="page-wrapper">{children}</div>
            </CSSTransition>
          </TransitionGroup>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 z-10 text-xs p-4 bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-gray-600 mb-1">
              &copy; {new Date().getFullYear()} BlockRecruit. 保留所有权利。
            </div>
            <div className="text-gray-600">
              由{' '}
              <a
                href="https://openbuild.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                OpenBuild
              </a>{' '}
              和{' '}
              <a
                href="https://youbetdao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                YoubetDAO
              </a>{' '}
              支持 🪁
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
