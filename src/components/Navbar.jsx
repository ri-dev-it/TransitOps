import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-[#D8C9A7]/70 bg-[#F6F5F2]/90 backdrop-blur dark:border-[#3B433D] dark:bg-[#171A19]/90">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="rounded-full border border-[#D8C9A7] bg-white p-2 text-sm text-[#2A2A2A] shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            {sidebarOpen ? '☰' : '☰'}
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Operations</p>
            <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Welcome back, {user?.email || 'Operator'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/settings" className="rounded-full border border-[#D8C9A7] bg-white px-3 py-2 text-sm font-medium text-[#2A2A2A] dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            Settings
          </Link>
          <button onClick={logout} className="rounded-full bg-[#6E8B3D] px-3 py-2 text-sm font-semibold text-white">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
