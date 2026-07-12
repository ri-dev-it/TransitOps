import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  name: '',
  license_number: '',
  license_category: 'LMV',
  license_expiry_date: '',
  contact_number: '',
  safety_score: '',
  region: '',
};

function isExpired(date) {
  return new Date(date) < new Date();
}

export default function Drivers() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const canManage = ['fleet_manager', 'safety_officer', 'admin'].includes(user?.role);

  async function loadDrivers() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/drivers');
      setDrivers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drivers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDrivers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.license_number || !form.license_expiry_date || !form.contact_number) {
      setFormError('Name, license number, expiry date and contact number are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/drivers', { ...form, safety_score: Number(form.safety_score) || 100 });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadDrivers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add driver.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Driver Management</h1>
          <p className="text-sm text-ink-700">Profiles, license validity and safety scores.</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : '+ Add Driver'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {formError && (
            <div className="col-span-full text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">
              {formError}
            </div>
          )}
          <input className="input-field" placeholder="Full name" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="input-field" placeholder="License number" value={form.license_number}
            onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))} />
          <select className="input-field" value={form.license_category}
            onChange={(e) => setForm((f) => ({ ...f, license_category: e.target.value }))}>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
            <option value="MC">Motorcycle</option>
          </select>
          <input className="input-field" type="date" value={form.license_expiry_date}
            onChange={(e) => setForm((f) => ({ ...f, license_expiry_date: e.target.value }))} />
          <input className="input-field" placeholder="Contact number" value={form.contact_number}
            onChange={(e) => setForm((f) => ({ ...f, contact_number: e.target.value }))} />
          <input className="input-field" type="number" placeholder="Safety score (0-100)" value={form.safety_score}
            onChange={(e) => setForm((f) => ({ ...f, safety_score: e.target.value }))} />
          <input className="input-field" placeholder="Region" value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving…' : 'Save Driver'}
          </button>
        </form>
      )}

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-700 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">License No.</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Expiry</th>
              <th className="text-left px-4 py-3">Safety Score</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-700">Loading…</td></tr>
            ) : drivers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-700">No drivers found.</td></tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id} className="hover:bg-mist-50">
                  <td className="px-4 py-3">{d.name}</td>
                  <td className="px-4 py-3 font-mono">{d.license_number}</td>
                  <td className="px-4 py-3">{d.license_category}</td>
                  <td className={`px-4 py-3 font-mono ${isExpired(d.license_expiry_date) ? 'text-red-600 font-semibold' : ''}`}>
                    {new Date(d.license_expiry_date).toLocaleDateString()}
                    {isExpired(d.license_expiry_date) && ' (Expired)'}
                  </td>
                  <td className="px-4 py-3 font-mono">{Number(d.safety_score).toFixed(0)}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">{d.contact_number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
