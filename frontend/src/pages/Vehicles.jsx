import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ registration_number: '', model: '', type: '', max_load_capacity: '', acquisition_cost: '' });
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = ['fleet_manager', 'admin'].includes(user.role);

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setVehicles(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/vehicles/${editId}` : '/api/vehicles';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ registration_number: '', model: '', type: '', max_load_capacity: '', acquisition_cost: '' });
    fetchVehicles();
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    await fetch(`/api/vehicles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    fetchVehicles();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Vehicle Registry</h1>
        {isAdmin && <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="bg-[var(--accent)] text-white px-4 py-2 rounded-full">+ Register</button>}
      </div>
      <table className="w-full bg-white rounded-3xl shadow-sm border border-[#D8C9A7]">
        <thead className="bg-[#F6F5F2]"><tr><th className="p-4">Registration</th><th className="p-4">Model</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} className="border-t">
              <td className="p-4">{v.registration_number}</td><td className="p-4">{v.model}</td>
              <td className="p-4"><StatusBadge status={v.status} /></td>
              <td className="p-4 flex gap-2">
                <button onClick={() => { setEditId(v.id); setFormData(v); setIsModalOpen(true); }} className="text-blue-500">Edit</button>
                {isAdmin && <button onClick={() => deleteVehicle(v.id)} className="text-red-500">Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}