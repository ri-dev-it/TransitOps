import { NavLink } from 'react-router-dom';

export default function Sidebar({ open }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || '';
  const canAccessManagement = ['fleet_manager', 'financial_analyst', 'admin'].includes(role);
  const navClass = ({ isActive }) =>
    `flex h-11 items-center rounded-2xl px-3 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-[var(--accent)] text-white shadow-sm'
        : 'text-[#2A2A2A] hover:bg-[#D8C9A7]/30 dark:text-[#F5F5F5]'
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-[#D8C9A7]/70 bg-white p-4 transition-all duration-300 dark:border-[#3B433D] dark:bg-[#1F2421] md:flex ${
        open ? 'w-64' : 'w-20'
      }`}
    >
      <div className="mb-8 flex h-12 items-center px-2">
        <h2 className="truncate text-xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">
          {open ? 'TransitOps' : 'TO'}
        </h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <NavLink to="/" className={navClass}>{open ? 'Dashboard' : 'D'}</NavLink>
        <NavLink to="/trips" className={navClass}>{open ? 'Trips' : 'T'}</NavLink>
        <NavLink to="/vehicles" className={navClass}>{open ? 'Vehicles' : 'V'}</NavLink>
        <NavLink to="/drivers" className={navClass}>{open ? 'Drivers' : 'DR'}</NavLink>

        {canAccessManagement && (
          <>
            {open && (
              <div className="mt-5 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#6B6B6B] dark:text-[#B4B4B4]">
                Management
              </div>
            )}
            <NavLink to="/maintenance" className={navClass}>{open ? 'Maintenance' : 'M'}</NavLink>
            <NavLink to="/reports" className={navClass}>{open ? 'Reports' : 'R'}</NavLink>
            <NavLink to="/fuel" className={navClass}>{open ? 'Fuel & Expenses' : 'F'}</NavLink>
          </>
        )}
      </nav>

      <div className="pt-4">
        <button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="h-11 w-full rounded-2xl border border-red-200 px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
        >
          {open ? 'Logout' : 'X'}
        </button>
      </div>
    </aside>
  );
}
