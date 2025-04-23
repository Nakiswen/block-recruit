'use client';

import './globals.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// 使用动态导入优化首屏加载性能
const Navigation = dynamic(
  () => import('ui').then((mod) => mod.Navigation),
  { ssr: false, loading: () => <div className="h-16 bg-white shadow-md"></div> }
);

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [shootingStars, setShootingStars] = useState<Array<{id: number, top: number, left: number, delay: number}>>([]);

  // 创建随机流星效果
  useEffect(() => {
    const stars = [];
    const starCount = 5;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        id: i,
        top: Math.random() * 70, // 控制高度分布
        left: 30 + Math.random() * 50, // 控制水平分布
        delay: Math.random() * 15 // 随机延迟时间
      });
    }
    
    setShootingStars(stars);
  }, []);

  return (
    <html lang="zh">
      <body className={inter.className}>
        <Navigation />
        <main className="container mx-auto px-4 py-8 min-h-screen">
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
            <CSSTransition
              key={pathname}
              timeout={300}
              classNames="page-transition"
              unmountOnExit
            >
              <div className="page-wrapper">
                {children}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </main>
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <Link href="/" className="text-xl font-bold mb-4 inline-block">
                  <span className="gradient-text">BlockRecruit</span>
                </Link>
                <p className="text-gray-300 mb-4">
                  将AI与区块链技术相结合，打造Web3行业的专业招聘解决方案
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold mb-4"><span className="gradient-text">产品</span></h4>
                  <ul className="space-y-2">
                    <li><Link href="/resume-screening" className="text-gray-300 hover:text-white transition-colors duration-200">简历筛选</Link></li>
                    <li><Link href="/interview" className="text-gray-300 hover:text-white transition-colors duration-200">智能面试官</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4"><span className="gradient-text">关于我们</span></h4>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">团队介绍</Link></li>
                    <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">联系我们</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} BlockRecruit. 保留所有权利。</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 