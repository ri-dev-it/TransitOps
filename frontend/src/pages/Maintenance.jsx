import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const EMPTY_FORM = { vehicle_id: '', service_type: '', description: '', cost: '' };

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [logsRes, vehiclesRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles'),
      ]);
      setLogs(logsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load maintenance logs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    if (!form.vehicle_id || !form.service_type) {
      setFormError('Vehicle and service type are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/maintenance', { ...form, cost: Number(form.cost) || 0 });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create maintenance record.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClose(id) {
    setError('');
    try {
      await api.post(`/maintenance/${id}/close`);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close maintenance record.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Maintenance Log</h1>
          <p className="text-sm text-ink-700">Opening a record puts the vehicle In Shop; closing restores it.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Log Maintenance'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {formError && (
            <div className="col-span-full text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">
              {formError}
            </div>
          )}
          <select className="input-field" value={form.vehicle_id}
            onChange={(e) => setForm((f) => ({ ...f, vehicle_id: e.target.value }))}>
            <option value="">Select vehicle</option>
            {vehicles.filter((v) => v.status !== 'On Trip').map((v) => (
              <option key={v.id} value={v.id}>{v.registration_number} — {v.name} ({v.status})</option>
            ))}
          </select>
          <input className="input-field" placeholder="Service type (e.g. Oil Change)" value={form.service_type}
            onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))} />
          <input className="input-field" placeholder="Description (optional)" value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Estimated cost" value={form.cost}
            onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} />
          <button type="submit" disabled={submitting} className="btn-primary col-span-full md:col-span-1">
            {submitting ? 'Saving…' : 'Open Record'}
          </button>
        </form>
      )}

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-700 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Vehicle</th>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Cost</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Opened</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-700">Loading…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-700">No maintenance records.</td></tr>
            ) : (
              logs.map((m) => (
                <tr key={m.id} className="hover:bg-mist-50">
                  <td className="px-4 py-3 font-mono">{m.registration_number}</td>
                  <td className="px-4 py-3">{m.service_type}</td>
                  <td className="px-4 py-3 font-mono">₹{Number(m.cost).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3">{new Date(m.started_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {m.status === 'Open' && (
                      <button className="text-xs text-signal-600 font-medium" onClick={() => handleClose(m.id)}>Close</button>
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
