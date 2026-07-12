import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartPlaceholder from '../components/ChartPlaceholder';
import StatusBadge from '../components/StatusBadge';
import { mockDrivers, mockMaintenance, mockTrips } from '../utils/mockData';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [fuelAnalytics, setFuelAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const queryParams = new URLSearchParams(filters).toString();
        
        // Fetch both KPIs and Reports
        const [kpiRes, reportRes] = await Promise.all([
          fetch(`/api/dashboard/kpis?${queryParams}`, { headers }),
          fetch('/api/reports', { headers })
        ]);

        if (kpiRes.ok) setKpis(await kpiRes.json());
        if (reportRes.ok) {
          const reportData = await reportRes.json();
          // Take top 3 for analytics preview
          setFuelAnalytics(reportData.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Operations overview</p>
          <h1 className="mt-2 text-3xl font-semibold">Smart Transport Operations Platform</h1>
        </div>
        
        <div className="flex gap-3">
          <select name="type" onChange={handleFilterChange} value={filters.type} className="rounded-full border border-[#D8C9A7]/70 bg-[#F6F5F2] px-4 py-2 text-sm text-[#2A2A2A] outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            <option value="">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
          <select name="status" onChange={handleFilterChange} value={filters.status} className="rounded-full border border-[#D8C9A7]/70 bg-[#F6F5F2] px-4 py-2 text-sm text-[#2A2A2A] outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-[#6B6B6B]">Loading metrics...</div>
      ) : kpis ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active Vehicles" value={kpis.active_vehicles} hint="Currently on route" />
          <StatCard label="Available Vehicles" value={kpis.available_vehicles} hint="Ready for dispatch" />
          <StatCard label="In Maintenance" value={kpis.vehicles_in_maintenance} hint="In shop" />
          <StatCard label="Fleet Utilization" value={`${kpis.fleet_utilization_percent}%`} hint="Active vs Total" accent />
          <StatCard label="Active Trips" value={kpis.active_trips} hint="Dispatched" accent />
          <StatCard label="Pending Trips" value={kpis.pending_trips} hint="Drafts" />
          <StatCard label="Drivers On Duty" value={kpis.drivers_on_duty} hint="Active personnel" />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPlaceholder title="Fleet utilization" subtitle="Capacity versus active routes" />
        <div className="card p-5 bg-white border border-[#D8C9A7]/70 rounded-3xl dark:bg-[#242826] dark:border-[#3B433D]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Fuel analytics</h3>
            <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Cost efficiency by asset</p>
          </div>
          <div className="space-y-3">
            {fuelAnalytics.length > 0 ? fuelAnalytics.map((vehicle) => (
              <div key={vehicle.registration_number} className="flex items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-4 py-3 dark:border-[#3B433D] dark:bg-[#1F2421]">
                <div>
                  <p className="font-semibold">{vehicle.registration_number}</p>
                  <p className="text-sm text-[#6B6B6B]">Cost: ${vehicle.operational_cost.toFixed(2)}</p>
                </div>
                <p className="text-sm font-semibold text-[#6E8B3D]">{vehicle.fuel_efficiency} km/L</p>
              </div>
            )) : <p className="text-sm text-[#6B6B6B]">No fuel data logged yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}