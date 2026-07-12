import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_category: '',
    license_expiry_date: '',
    contact_number: ''
  });

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit New Driver
  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false); // Close modal
        // Reset form
        setFormData({ name: '', license_number: '', license_category: '', license_expiry_date: '', contact_number: '' }); 
        fetchDrivers(); // Refresh the table to show the new driver
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to add driver:", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#6B6B6B]">Loading drivers...</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Driver Management</h1>
          <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">
            Maintain personnel profiles, track license validity, and monitor safety scores.
          </p>
        </div>
        {/* Added onClick handler to open modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-[#6E8B3D] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#5F7633] hover:shadow-md active:scale-[0.98]"
        >
          + Add Driver
        </button>
      </div>

      {/* Driver Master List Table */}
      <div className="card overflow-hidden rounded-3xl border border-[#D8C9A7]/70 bg-white shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F5F2] text-[#6B6B6B] dark:bg-[#1F2421] dark:text-[#B4B4B4]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Name & Contact</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">License Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Safety Score</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C9A7]/30 dark:divide-[#3B433D]/50">
              {drivers.map((driver) => {
                const isExpired = new Date(driver.license_expiry_date) < new Date();
                
                return (
                  <tr key={driver.id} className="transition-colors hover:bg-[#FCFAF7] dark:hover:bg-[#1F2421]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{driver.name}</p>
                      <p className="text-[#6B6B6B] dark:text-[#B4B4B4]">{driver.contact_number}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{driver.license_number}</p>
                      <p className="text-[#6B6B6B] dark:text-[#B4B4B4]">Class: {driver.license_category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={isExpired ? 'font-semibold text-red-500' : 'text-[#2A2A2A] dark:text-[#F5F5F5]'}>
                        {new Date(driver.license_expiry_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">{driver.safety_score}/100</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={driver.status} />
                    </td>
                  </tr>
                );
              })}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#6B6B6B] dark:text-[#B4B4B4]">
                    No drivers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#D8C9A7]/70 bg-white p-6 shadow-xl dark:border-[#3B433D] dark:bg-[#242826]">
            <h2 className="mb-4 text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Add New Driver</h2>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">License Number</label>
                  <input type="text" name="license_number" required value={formData.license_number} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Category</label>
                  <select name="license_category" required value={formData.license_category} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
                    <option value="">Select Class</option>
                    <option value="Light">Light Vehicle</option>
                    <option value="Heavy">Heavy Commercial</option>
                    <option value="Hazmat">Hazmat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Expiry Date</label>
                  <input type="date" name="license_expiry_date" required value={formData.license_expiry_date} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Contact Number</label>
                  <input type="tel" name="contact_number" required value={formData.contact_number} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#6B6B6B] transition-all hover:bg-gray-100 dark:hover:bg-[#1F2421]">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-[#6E8B3D] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5F7633]">
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}