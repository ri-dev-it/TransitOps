import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadKpis() {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.region) params.region = filters.region;
      const { data } = await api.get('/dashboard/kpis', { params });
      setKpis(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKpis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.status, filters.region]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Operations Dashboard</h1>
          <p className="text-sm text-ink-700">Live snapshot of fleet, drivers and trip activity.</p>
        </div>
        <div className="flex gap-2">
          <select
            className="input-field w-40"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="">All types</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Bike">Bike</option>
          </select>
          <select
            className="input-field w-40"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          <input
            className="input-field w-40"
            placeholder="Region"
            value={filters.region}
            onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
          />
        </div>
      </div>

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      {loading && !kpis ? (
        <p className="text-sm text-ink-700">Loading KPIs…</p>
      ) : kpis ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Active Vehicles" value={kpis.active_vehicles} />
          <StatCard label="Available Vehicles" value={kpis.available_vehicles} />
          <StatCard label="In Maintenance" value={kpis.vehicles_in_maintenance} />
          <StatCard label="Active Trips" value={kpis.active_trips} accent />
          <StatCard label="Pending Trips" value={kpis.pending_trips} />
          <StatCard label="Drivers On Duty" value={kpis.drivers_on_duty} />
          <StatCard label="Fleet Utilization" value={kpis.fleet_utilization_percent} suffix="%" accent />
        </div>
      ) : null}
    </div>
  );
}
