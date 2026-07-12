import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  // Retrieve user and role once to avoid redeclaration errors
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || '';

  // Logic to restrict access: only these roles see financial/admin sections
  const canAccessManagement = ['fleet_manager', 'financial_analyst', 'admin'].includes(role);

  return (
    <aside className="w-64 min-h-screen bg-[#F6F5F2] p-6 dark:bg-[#1F2421]">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">TransitOps</h2>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Dashboard</NavLink>
        <NavLink to="/trips" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Trips</NavLink>
        <NavLink to="/vehicles" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Vehicles</NavLink>
        <NavLink to="/drivers" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Drivers</NavLink>
        
        {/* Role-Based Access Control (RBAC) UI Enforcement */}
        {canAccessManagement && (
          <>
            <div className="mt-4 text-xs font-bold text-[#6B6B6B] uppercase">Management</div>
            <NavLink to="/maintenance" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Maintenance</NavLink>
            <NavLink to="/reports" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Reports</NavLink>
            <NavLink to="/fuel-expenses" className="p-2 rounded-lg hover:bg-[#D8C9A7]/20">Fuel & Expenses</NavLink>
          </>
        )}
      </nav>
      
      <div className="absolute bottom-6">
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }} 
          className="text-red-500 font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}