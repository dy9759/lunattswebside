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
    <div
      className="flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark antialiased overflow-hidden"
      style={{ height: '100vh' }} // 固定视口高度，防止页面溢出
    >
      <Header />

      <main
        className="container mx-auto p-2 md:p-4"
        style={{
          height: 'calc(100vh - 12.5vh - 12.5vh)', // 减去Header和AudioPlayer的高度
          overflow: 'hidden' // 防止主内容区域溢出
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;