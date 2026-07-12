import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const EMPTY_FORM = {
  source: '',
  destination: '',
  vehicle_id: '',
  driver_id: '',
  cargo_weight: '',
  planned_distance: '',
};

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completingTrip, setCompletingTrip] = useState(null);
  const [completeForm, setCompleteForm] = useState({ actual_distance: '', fuel_consumed: '', revenue: '' });
  const [actionError, setActionError] = useState('');

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get('/trips'),
        api.get('/vehicles', { params: { dispatchable: 'true' } }),
        api.get('/drivers', { params: { dispatchable: 'true' } }),
      ]);
      setTrips(tripsRes.data);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trips.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const selectedVehicle = vehicles.find((v) => String(v.id) === String(form.vehicle_id));

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    if (!form.source || !form.destination || !form.vehicle_id || !form.driver_id || !form.cargo_weight || !form.planned_distance) {
      setFormError('All fields are required.');
      return;
    }
    if (selectedVehicle && Number(form.cargo_weight) > Number(selectedVehicle.max_load_capacity)) {
      setFormError(`Cargo weight exceeds this vehicle's max load capacity (${selectedVehicle.max_load_capacity}kg).`);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/trips', {
        ...form,
        cargo_weight: Number(form.cargo_weight),
        planned_distance: Number(form.planned_distance),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDispatch(id) {
    setActionError('');
    try {
      await api.post(`/trips/${id}/dispatch`);
      loadAll();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to dispatch trip.');
    }
  }

  async function handleCancel(id) {
    setActionError('');
    try {
      await api.post(`/trips/${id}/cancel`);
      loadAll();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to cancel trip.');
    }
  }

  async function handleComplete(e) {
    e.preventDefault();
    setActionError('');
    if (!completeForm.actual_distance || !completeForm.fuel_consumed) {
      setActionError('Actual distance and fuel consumed are required.');
      return;
    }
    try {
      await api.post(`/trips/${completingTrip.id}/complete`, {
        actual_distance: Number(completeForm.actual_distance),
        fuel_consumed: Number(completeForm.fuel_consumed),
        revenue: completeForm.revenue ? Number(completeForm.revenue) : undefined,
      });
      setCompletingTrip(null);
      setCompleteForm({ actual_distance: '', fuel_consumed: '', revenue: '' });
      loadAll();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to complete trip.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Trips & Dispatch</h1>
          <p className="text-sm text-ink-700">Draft → Dispatched → Completed / Cancelled.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Create Trip'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {formError && (
            <div className="col-span-full text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">
              {formError}
            </div>
          )}
          <input className="input-field" placeholder="Source" value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} />
          <input className="input-field" placeholder="Destination" value={form.destination}
            onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} />
          <select className="input-field" value={form.vehicle_id}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_id: e.target.value }))}>
            <option value="">Select available vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.registration_number} — {v.name} (max {v.max_load_capacity}kg)</option>
            ))}
          </select>
          <select className="input-field" value={form.driver_id}
            onChange={(e) => setForm((f) => ({ ...f, driver_id: e.target.value }))}>
            <option value="">Select available driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name} — {d.license_number}</option>
            ))}
          </select>
          <input className="input-field" type="number" placeholder="Cargo weight (kg)" value={form.cargo_weight}
            onChange={(e) => setForm((f) => ({ ...f, cargo_weight: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Planned distance (km)" value={form.planned_distance}
            onChange={(e) => setForm((f) => ({ ...f, planned_distance: e.target.value }))} />
          <button type="submit" disabled={submitting} className="btn-primary col-span-full md:col-span-1">
            {submitting ? 'Creating…' : 'Create Draft Trip'}
          </button>
        </form>
      )}

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}
      {actionError && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{actionError}</div>}

      {completingTrip && (
        <form onSubmit={handleComplete} className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <p className="col-span-full text-sm font-medium">Completing trip #{completingTrip.id}: {completingTrip.source} → {completingTrip.destination}</p>
          <input className="input-field" type="number" placeholder="Actual distance (km)" value={completeForm.actual_distance}
            onChange={(e) => setCompleteForm((f) => ({ ...f, actual_distance: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Fuel consumed (L)" value={completeForm.fuel_consumed}
            onChange={(e) => setCompleteForm((f) => ({ ...f, fuel_consumed: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Revenue (optional)" value={completeForm.revenue}
            onChange={(e) => setCompleteForm((f) => ({ ...f, revenue: e.target.value }))} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Mark Completed</button>
            <button type="button" className="btn-ghost" onClick={() => setCompletingTrip(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-700 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Route</th>
              <th className="text-left px-4 py-3">Vehicle</th>
              <th className="text-left px-4 py-3">Driver</th>
              <th className="text-left px-4 py-3">Cargo</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-700">Loading…</td></tr>
            ) : trips.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-700">No trips yet.</td></tr>
            ) : (
              trips.map((t) => (
                <tr key={t.id} className="hover:bg-mist-50">
                  <td className="px-4 py-3">{t.source} → {t.destination}</td>
                  <td className="px-4 py-3 font-mono">{t.registration_number}</td>
                  <td className="px-4 py-3">{t.driver_name}</td>
                  <td className="px-4 py-3 font-mono">{Number(t.cargo_weight).toLocaleString()} kg</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 space-x-2">
                    {t.status === 'Draft' && (
                      <>
                        <button className="text-xs text-signal-600 font-medium" onClick={() => handleDispatch(t.id)}>Dispatch</button>
                        <button className="text-xs text-red-600 font-medium" onClick={() => handleCancel(t.id)}>Cancel</button>
                      </>
                    )}
                    {t.status === 'Dispatched' && (
                      <>
                        <button className="text-xs text-signal-600 font-medium" onClick={() => setCompletingTrip(t)}>Complete</button>
                        <button className="text-xs text-red-600 font-medium" onClick={() => handleCancel(t.id)}>Cancel</button>
                      </>
                    )}
                    {['Completed', 'Cancelled'].includes(t.status) && (
                      <span className="text-xs text-ink-700">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
