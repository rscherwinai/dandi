'use client';

import Sidebar from './Sidebar';
import SidebarToggle from './SidebarToggle';
import useSidebar from '@/hooks/useSidebar';

export default function ClientSidebarWrapper() {
  return (
    <>
      <Sidebar />
      <SidebarToggle />
    </>
  );
}