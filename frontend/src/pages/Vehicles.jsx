import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  registration_number: '',
  name: '',
  type: 'Van',
  max_load_capacity: '',
  odometer: '',
  acquisition_cost: '',
  region: '',
};

export default function Vehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const canManage = ['fleet_manager', 'admin'].includes(user?.role);

  async function loadVehicles() {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await api.get('/vehicles', { params });
      setVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!form.registration_number || !form.name || !form.type || !form.max_load_capacity) {
      setFormError('Registration number, name, type and max load capacity are required.');
      return;
    }
    if (Number(form.max_load_capacity) <= 0) {
      setFormError('Max load capacity must be greater than 0.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/vehicles', {
        ...form,
        max_load_capacity: Number(form.max_load_capacity),
        odometer: Number(form.odometer) || 0,
        acquisition_cost: Number(form.acquisition_cost) || 0,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadVehicles();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to register vehicle.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Vehicle Registry</h1>
          <p className="text-sm text-ink-700">Master list of fleet assets and their lifecycle status.</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          {canManage && (
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? 'Cancel' : '+ Register Vehicle'}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {formError && (
            <div className="col-span-full text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">
              {formError}
            </div>
          )}
          <input className="input-field" placeholder="Registration No. (e.g. VAN-09)" value={form.registration_number}
            onChange={(e) => setForm((f) => ({ ...f, registration_number: e.target.value }))} />
          <input className="input-field" placeholder="Name / Model" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <select className="input-field" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Bike">Bike</option>
          </select>
          <input className="input-field" type="number" placeholder="Max Load Capacity (kg)" value={form.max_load_capacity}
            onChange={(e) => setForm((f) => ({ ...f, max_load_capacity: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Odometer" value={form.odometer}
            onChange={(e) => setForm((f) => ({ ...f, odometer: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Acquisition Cost" value={form.acquisition_cost}
            onChange={(e) => setForm((f) => ({ ...f, acquisition_cost: e.target.value }))} />
          <input className="input-field" placeholder="Region" value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving…' : 'Save Vehicle'}
          </button>
        </form>
      )}

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-700 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Reg. No.</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Max Load</th>
              <th className="text-left px-4 py-3">Odometer</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Region</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-700">Loading…</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-700">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-mist-50">
                  <td className="px-4 py-3 font-mono">{v.registration_number}</td>
                  <td className="px-4 py-3">{v.name}</td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3 font-mono">{Number(v.max_load_capacity).toLocaleString()} kg</td>
                  <td className="px-4 py-3 font-mono">{Number(v.odometer).toLocaleString()} km</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3">{v.region || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
