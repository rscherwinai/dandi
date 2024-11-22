import ClientSidebarWrapper from '@/components/ClientSidebarWrapper';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f7f8f9]">
      <ClientSidebarWrapper />
      <main className="flex-1 transition-all duration-300 ml-16 lg:ml-64 p-4">
        {children}
      </main>
    </div>
  );
}