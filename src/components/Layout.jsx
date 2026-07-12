import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#2A2A2A] transition-colors duration-300 dark:bg-[#171A19] dark:text-[#F5F5F5]">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((value) => !value)} />
        <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${sidebarOpen ? 'md:pl-[272px]' : 'md:pl-20'}`}>
          <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((value) => !value)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
