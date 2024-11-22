'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import useSidebar from '@/hooks/useSidebar';
import * as Icons from './icons';

export default function Sidebar() {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const menuItems = [
    { 
      name: 'Overview', 
      path: '/dashboards',
      icon: Icons.HomeIcon
    },
    { 
      name: 'Research Assistant', 
      path: '/dashboards/research',
      icon: Icons.ResearchIcon
    },
    { 
      name: 'Research Reports', 
      path: '/dashboards/reports',
      icon: Icons.ReportsIcon
    },
    { 
      name: 'API Playground', 
      path: '/dashboards/playground',
      icon: Icons.PlaygroundIcon
    },
    { 
      name: 'Invoices', 
      path: '/dashboards/invoices',
      icon: Icons.InvoiceIcon
    },
    { 
      name: 'Documentation', 
      path: '/dashboards/docs',
      icon: Icons.DocsIcon
    }
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? '4rem' : '16rem',
        transition: { duration: 0.3 }
      }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboards" className="flex items-center gap-2">
          <span className="text-xl font-bold">
            {!isCollapsed && "Dandi AI"}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.li key={item.name} whileHover={{ x: 5 }}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {Icon && (
                    <span className={`flex items-center justify-center w-5 h-5 ${
                      isActive ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </span>
                  )}
                  {!isCollapsed && (
                    <span className="whitespace-nowrap text-sm">
                      {item.name}
                    </span>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.div>
  );
}