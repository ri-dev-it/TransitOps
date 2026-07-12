import { useState, useEffect } from 'react';

export default function Fuel() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_id: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0] // Defaults to today
  });

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      const [logsRes, vehiclesRes] = await Promise.all([
        // Ensure this matches the route in your app.js
        fetch('/api/fuel-logs', { headers }),
        fetch('/api/vehicles', { headers })
      ]);

      if (logsRes.ok) setLogs(await logsRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateLog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicle_id: parseInt(formData.vehicle_id),
        liters: parseFloat(formData.liters),
        cost: parseFloat(formData.cost),
        date: formData.date
      };

      const response = await fetch('/api/fuel-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      setIsModalOpen(false);
      setFormData({ vehicle_id: '', liters: '', cost: '', date: new Date().toISOString().split('T')[0] });
      fetchData(); 
    } catch (error) {
      console.error("Failed to create fuel log:", error);
      alert("Network error occurred.");
    }
  };

  if (loading) return <div className="p-8 text-center text-[#6B6B6B]">Loading fuel logs...</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Fuel & Expenses</h1>
          <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">
            Record fuel consumption and monitor operational costs per vehicle.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-[#6E8B3D] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5F7633]"
        >
          + Add Fuel Log
        </button>
      </div>

      <div className="card overflow-hidden rounded-3xl border border-[#D8C9A7]/70 bg-white shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F5F2] text-[#6B6B6B] dark:bg-[#1F2421] dark:text-[#B4B4B4]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Liters Filled</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C9A7]/30 dark:divide-[#3B433D]/50">
              {logs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-[#FCFAF7] dark:hover:bg-[#1F2421]">
                  <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{log.registration_number}</td>
                  <td className="px-6 py-4">{log.liters} L</td>
                  <td className="px-6 py-4 font-semibold text-red-600">${log.cost}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[#6B6B6B]">
                    No fuel logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#D8C9A7]/70 bg-white p-6 shadow-xl dark:border-[#3B433D] dark:bg-[#242826]">
            <h2 className="mb-4 text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Log Fuel Expense</h2>
            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Vehicle</label>
                <select name="vehicle_id" required value={formData.vehicle_id} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registration_number}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Liters</label>
                  <input type="number" name="liters" required min="1" step="0.1" value={formData.liters} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Total Cost ($)</label>
                  <input type="number" name="cost" required min="1" step="0.01" value={formData.cost} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Date</label>
                <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#6B6B6B] hover:bg-gray-100 dark:hover:bg-[#1F2421]">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-[#6E8B3D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5F7633]">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}