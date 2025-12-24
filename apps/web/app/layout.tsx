import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${inter.className} min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
