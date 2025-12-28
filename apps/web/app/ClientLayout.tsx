'use client';

import { useEffect, useState } from 'react';
import { Navigation } from 'ui';
import { Providers } from './providers';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [shootingStars, setShootingStars] = useState<
    Array<{ id: number; top: number; left: number; delay: number }>
  >([]);

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
  }, []);

  return (
    <Providers>
      <Navigation googleAuthEnabled={true} showMenu={false} />
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

        <div className="page-wrapper">{children}</div>
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
    </Providers>
  );
}
