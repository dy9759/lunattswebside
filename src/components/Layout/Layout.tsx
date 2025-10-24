/*
 * @Author: zhujian
 * @Date: 2025-09-22 14:01:32
 * @LastEditors: zhujian
 * @LastEditTime: 2025-10-09 10:38:14
 */
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark antialiased">
      <Header />

      <main className="flex-grow container mx-auto p-2 md:p-4 pb-24 md:pb-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;