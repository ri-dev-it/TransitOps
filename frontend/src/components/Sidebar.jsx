import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◉', roles: ['fleet-manager', 'driver', 'safety-officer', 'financial-analyst'] },
  { to: '/vehicles', label: 'Vehicles', icon: '▣', roles: ['fleet-manager', 'safety-officer'] },
  { to: '/drivers', label: 'Drivers', icon: '◎', roles: ['fleet-manager'] },
  { to: '/trips', label: 'Trips', icon: '↗', roles: ['fleet-manager', 'driver'] },
  { to: '/maintenance', label: 'Maintenance', icon: '⚙', roles: ['fleet-manager', 'safety-officer'] },
  { to: '/fuel', label: 'Fuel & Expenses', icon: '⛽', roles: ['fleet-manager', 'financial-analyst'] },
  { to: '/reports', label: 'Reports', icon: '◫', roles: ['fleet-manager', 'safety-officer', 'financial-analyst'] },
  { to: '/notifications', label: 'Notifications', icon: '🔔', roles: ['fleet-manager', 'driver', 'safety-officer', 'financial-analyst'] },
];

export default function Sidebar({ open, onToggle }) {
  const { user } = useAuth();
  const role = user?.role || 'fleet-manager';
  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className={`fixed left-0 top-0 z-30 h-screen overflow-hidden border-r border-[#3D5B4C] bg-[linear-gradient(180deg,#295A4B_0%,#2F6554_100%)] text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition-all duration-300 ${open ? 'w-[272px]' : 'w-20'} md:translate-x-0`}>
      <div className="flex h-full flex-col">
        <div className="flex-shrink-0 px-4 py-5">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6E8B3D] text-lg font-semibold shadow-[0_8px_16px_rgba(0,0,0,0.18)]">T</div>
              {open && (
                <div>
                  <p className="text-sm font-semibold tracking-[0.2px] text-[#F7F5EC]">TransitOps</p>
                  <p className="text-xs text-[rgba(255,255,255,0.72)]">Smart Mobility</p>
                </div>
              )}
            </div>
            <button onClick={onToggle} className="hidden rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:inline-flex" title={open ? 'Collapse sidebar' : 'Expand sidebar'}>
              {open ? '←' : '→'}
            </button>
          </div>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto px-1 pb-3">
          <div className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={open ? '' : item.label}
                className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-250 ease-out ${isActive ? 'bg-[#D9E6A7] text-[#1F3A2E] shadow-[0_10px_22px_rgba(0,0,0,0.16)] ring-1 ring-white/20' : 'text-[#F7F5EC] hover:-translate-y-1 hover:translate-x-1 hover:scale-[1.02] hover:bg-[rgba(255,255,255,0.08)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:backdrop-blur-[8px]'} ${!open && 'justify-center px-2'}`}
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex h-5 w-5 items-center justify-center text-[20px] leading-none transition-transform duration-250 group-hover:brightness-125 ${isActive ? 'text-white' : 'text-[#F7F5EC]'}`}>
                      {item.icon}
                    </span>
                    {open && <span className="text-[16px] font-semibold tracking-[0.2px]">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="mt-auto flex-shrink-0 border-t border-white/10 p-4 text-sm text-[#E8E4DA]">
          {open ? (
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-3 shadow-[0_8px_18px_rgba(0,0,0,0.12)] backdrop-blur-[8px]">
              <p className="font-semibold text-[#F7F5EC]">Fleet Operations</p>
              <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.72)]">All systems at a glance</p>
            </div>
          ) : (
            <div className="flex justify-center text-xl">✦</div>
          )}
        </div>
      </div>
    </aside>
  );
}
