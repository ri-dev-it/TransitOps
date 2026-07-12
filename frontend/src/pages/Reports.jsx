import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/reports');
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleExportCsv() {
    try {
      const response = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transitops-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export CSV.');
    }
  }

  const chartData = report.map((r) => ({
    name: r.registration_number,
    'Operational Cost': r.operational_cost,
    'Revenue': r.revenue,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Reports & Analytics</h1>
          <p className="text-sm text-ink-700">Fuel efficiency, operational cost and ROI per vehicle.</p>
        </div>
        <button className="btn-secondary" onClick={handleExportCsv}>Export CSV</button>
      </div>

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      {!loading && chartData.length > 0 && (
        <div className="card p-4 mb-6" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F7" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Operational Cost" fill="#28406A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Revenue" fill="#F5A623" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mist-50 text-ink-700 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Vehicle</th>
              <th className="text-left px-4 py-3">Distance</th>
              <th className="text-left px-4 py-3">Fuel Efficiency</th>
              <th className="text-left px-4 py-3">Operational Cost</th>
              <th className="text-left px-4 py-3">Revenue</th>
              <th className="text-left px-4 py-3">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-700">Loading…</td></tr>
            ) : report.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-700">No data yet.</td></tr>
            ) : (
              report.map((r) => (
                <tr key={r.vehicle_id} className="hover:bg-mist-50">
                  <td className="px-4 py-3 font-mono">{r.registration_number}</td>
                  <td className="px-4 py-3 font-mono">{r.total_distance_km.toLocaleString()} km</td>
                  <td className="px-4 py-3 font-mono">{r.fuel_efficiency_km_per_liter} km/L</td>
                  <td className="px-4 py-3 font-mono">₹{r.operational_cost.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">₹{r.revenue.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-mono font-semibold ${r.roi_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {r.roi_percent}%
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
