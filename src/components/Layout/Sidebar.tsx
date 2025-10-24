/*
 * @Author: zhujian
 * @Date: 2025-09-22 15:34:52
 * @LastEditors: zhujian
 * @LastEditTime: 2025-09-22 16:59:36
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { name: '首页', href: '/' },
    { name: 'API文档', href: '/docs' },
    { name: 'API测试', href: '/api-test' },
    { name: '使用指南', href: '/guide' },
    { name: '项目列表', href: '/items' },
    { name: '定价', href: '/pricing' },
    { name: '关于我们', href: '/about' },
    { name: '联系我们', href: '/contact' },
    { name: '用户数据权限', href: '/user-data' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Luna API</h1>
        <p className="text-sm text-gray-400 mt-1">开发者服务平台</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-500">
          {process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '正式环境' : '测试环境'}
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;