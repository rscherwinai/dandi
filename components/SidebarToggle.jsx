'use client';

import { motion } from 'framer-motion';
import useSidebar from '@/hooks/useSidebar';

export default function SidebarToggle() {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCollapsed}
      className={`fixed z-50 p-2 m-4 text-gray-600 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
        isCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      {isCollapsed ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
        </svg>
      )}
    </motion.button>
  );
}