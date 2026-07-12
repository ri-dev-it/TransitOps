import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { dashboardKpis, mockDrivers, mockMaintenance, mockTrips, mockVehicles } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });

  // Fetch KPIs whenever filters change
  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/dashboard/kpis?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setKpis(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Operations overview</p>
          <h1 className="mt-2 text-3xl font-semibold">Smart Transport Operations Platform</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">
            A premium front-end foundation for fleet visibility, dispatch coordination, maintenance oversight, and cost control.
          </p>
        </div>
        
        {/* Filters */}
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
          <select name="region" onChange={handleFilterChange} value={filters.region} className="rounded-full border border-[#D8C9A7]/70 bg-[#F6F5F2] px-4 py-2 text-sm text-[#2A2A2A] outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            <option value="">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
        </div>
      </div>

      {/* KPIs Grid */}
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
      ) : (
        <div className="py-8 text-center text-red-500">Failed to load metrics.</div>
      )}

      <div className="flex flex-wrap gap-3">
        {['Add Vehicle', 'Assign Driver', 'Create Trip', 'Generate Report'].map((action) => (
          <button key={action} className="rounded-full border border-[#D8C9A7] bg-white px-4 py-2 text-sm font-semibold text-[#2A2A2A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
            {action}
          </button>
        ))}
      </div>

      {/* Analytics & Layout Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPlaceholder title="Fleet utilization" subtitle="Capacity versus active routes" />
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fuel analytics</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Cost efficiency by lane and asset</p>
            </div>
            <div className="rounded-full bg-[#D8C9A7]/60 px-3 py-1 text-sm font-medium text-[#2A2A2A] dark:bg-[#D8C9A7]/20 dark:text-[#EADDC2]">Q3 focus</div>
          </div>
          <div className="space-y-3">
            {['TR-204', 'TR-221', 'TR-407'].map((vehicle, index) => (
              <div key={vehicle} className="flex items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421]">
                <div>
                  <p className="font-semibold">{vehicle}</p>
                  <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{['Best efficiency', 'Stabilizing', 'Watch cost'][index]}</p>
                </div>
                <p className="text-sm font-semibold text-[#6E8B3D]">{['8.4 km/L', '7.1 km/L', '6.8 km/L'][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fleet status</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Live fleet posture</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-[#D8C9A7]/60">
              <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#6E8B3D 0 58%, #D8C9A7 58% 78%, #A7A7A7 78% 100%)' }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#2A2A2A] dark:bg-[#242826] dark:text-[#F5F5F5]">58%</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#6E8B3D]" />Active</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#D8C9A7]" />Maintenance</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#A7A7A7]" />Offline</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent activity</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Recent operations updates</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Vehicle assigned', detail: 'TR-204 assigned to Mina Chen' },
              { label: 'Driver checked in', detail: 'Aarav Patel checked in for Route 12' },
              { label: 'Fuel updated', detail: 'TR-221 fuel log added for today' },
              { label: 'Maintenance scheduled', detail: 'TR-312 brake inspection booked' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-3 py-3 dark:border-[#3B433D] dark:bg-[#1F2421]">
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent trips</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Live dispatch snapshot</p>
            </div>
            <button className="rounded-full bg-[#6E8B3D] px-3 py-2 text-sm font-semibold text-white">View all</button>
          </div>
          <div className="space-y-3">
            {mockTrips.map((trip) => (
              <div key={trip.id} className="flex flex-wrap items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421]">
                <div>
                  <p className="font-semibold">{trip.route}</p>
                  <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{trip.vehicle} • {trip.driver}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{trip.eta}</span>
                  <StatusBadge status={trip.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Maintenance alerts</h3>
              <span className="rounded-full bg-[#D8C9A7]/60 px-3 py-1 text-sm font-medium">3 pending</span>
            </div>
            <div className="space-y-2">
              {mockMaintenance.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#F6F5F2] px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:bg-[#1F2421]">
                  <div>
                    <p className="font-semibold">{item.vehicle}</p>
                    <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{item.issue}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Driver status</h3>
              <span className="text-sm text-[#6E8B3D]">18 active</span>
            </div>
            <div className="space-y-2">
              {mockDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421]">
                  <div>
                    <p className="font-semibold">{driver.driver}</p>
                    <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{driver.license}</p>
                  </div>
                  <StatusBadge status={driver.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
