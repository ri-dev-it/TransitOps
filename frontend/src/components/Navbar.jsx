import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mockNotifications, mockVehicles } from '../utils/mockData';
import UserProfileCard from './UserProfileCard';

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];

    return mockVehicles.filter((vehicle) => {
      return [vehicle.id, vehicle.registration, vehicle.name, vehicle.type, vehicle.status, user?.email || ''].some((value) =>
        String(value).toLowerCase().includes(term)
      );
    });
  }, [search, user?.email]);

  return (
    <header className="sticky top-0 z-20 border-b border-[#D8C9A7]/70 bg-[#F6F5F2]/90 backdrop-blur dark:border-[#3B433D] dark:bg-[#171A19]/90">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="rounded-full border border-[#D8C9A7] bg-white p-2 text-sm text-[#2A2A2A] shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            {sidebarOpen ? '☰' : '☰'}
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Operations</p>
            <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Welcome back, {user?.email || 'Operator'}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">🔍</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vehicle by ID, registration, or driver..."
              className="input-field h-10 w-full pl-9 pr-3"
            />
            {search && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-[#D8C9A7]/70 bg-white p-2 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="rounded-xl px-3 py-2 text-sm text-[#2A2A2A] dark:text-[#F5F5F5]">
                      {vehicle.registration} • {vehicle.name}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl px-3 py-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">No vehicle found.</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotifications((value) => !value)} className="rounded-full border border-[#D8C9A7] bg-white p-2 text-sm text-[#2A2A2A] shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
                🔔
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#D8C9A7]/70 bg-white p-3 text-sm shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
                  {mockNotifications.slice(0, 4).map((notification) => (
                    <div key={notification.id} className="rounded-xl border border-[#D8C9A7]/40 px-3 py-2 text-[#2A2A2A] dark:text-[#F5F5F5]">
                      <p className="font-semibold">{notification.title}</p>
                      <p className="mt-1 text-xs text-[#6B6B6B] dark:text-[#B4B4B4]">{notification.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="rounded-full border border-[#D8C9A7] bg-white p-2 text-sm text-[#2A2A2A] shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" title="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <Link to="/settings" className="rounded-full border border-[#D8C9A7] bg-white px-3 py-2 text-sm font-medium text-[#2A2A2A] dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
              Settings
            </Link>
            <UserProfileCard user={user} />
            <button onClick={logout} className="rounded-full bg-[#6E8B3D] px-3 py-2 text-sm font-semibold text-white">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
