import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle_id: '',
    driver_id: '',
    cargo_weight: '',
    planned_distance: ''
  });

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      // Fetch Trips, Vehicles, and Drivers simultaneously
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch('/api/trips', { headers }),
        fetch('/api/vehicles', { headers }),
        fetch('/api/drivers', { headers })
      ]);

      if (tripsRes.ok) setTrips(await tripsRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit New Trip
  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false); // Close modal
        setFormData({ source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight: '', planned_distance: '' }); // Reset form
        fetchData(); // Refresh the table
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#6B6B6B]">Loading trips...</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Trip Management</h1>
          <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">
            Coordinate dispatch, monitor active routes, and enforce capacity regulations.
          </p>
        </div>
        {/* Added onClick handler to open modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-[#6E8B3D] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#5F7633] hover:shadow-md active:scale-[0.98]"
        >
          + Create Trip
        </button>
      </div>

      {/* Trip Master List Table */}
      <div className="card overflow-hidden rounded-3xl border border-[#D8C9A7]/70 bg-white shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F5F2] text-[#6B6B6B] dark:bg-[#1F2421] dark:text-[#B4B4B4]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Asset & Driver</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Cargo / Distance</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C9A7]/30 dark:divide-[#3B433D]/50">
              {trips.map((trip) => (
                <tr key={trip.id} className="transition-colors hover:bg-[#FCFAF7] dark:hover:bg-[#1F2421]">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{trip.source} →</p>
                    <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{trip.destination}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{trip.vehicle_reg || 'Unassigned'}</p>
                    <p className="text-[#6B6B6B] dark:text-[#B4B4B4]">{trip.driver_name || 'Unassigned'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#2A2A2A] dark:text-[#F5F5F5]">{trip.cargo_weight} kg</p>
                    <p className="text-[#6B6B6B] dark:text-[#B4B4B4]">{trip.planned_distance} km</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="px-6 py-4">
                    {trip.status === 'Draft' && (
                      <button className="text-sm font-semibold text-[#6E8B3D] hover:underline">Dispatch</button>
                    )}
                    {trip.status === 'Dispatched' && (
                      <button className="text-sm font-semibold text-blue-600 hover:underline">Complete</button>
                    )}
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#6B6B6B] dark:text-[#B4B4B4]">
                    No trips active or recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#D8C9A7]/70 bg-white p-6 shadow-xl dark:border-[#3B433D] dark:bg-[#242826]">
            <h2 className="mb-4 text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Create New Trip</h2>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Source</label>
                  <input type="text" name="source" required value={formData.source} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Destination</label>
                  <input type="text" name="destination" required value={formData.destination} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Vehicle</label>
                  <select name="vehicle_id" required value={formData.vehicle_id} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
                    <option value="">Select Vehicle</option>
                    {vehicles.filter(v => v.status === 'Available').map(v => (
                      <option key={v.id} value={v.id}>{v.registration_number} (Max: {v.max_load_capacity}kg)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Driver</label>
                  <select name="driver_id" required value={formData.driver_id} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]">
                    <option value="">Select Driver</option>
                    {drivers.filter(d => d.status === 'Available').map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Cargo Weight (kg)</label>
                  <input type="number" name="cargo_weight" required min="1" value={formData.cargo_weight} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#6B6B6B] dark:text-[#B4B4B4]">Planned Distance (km)</label>
                  <input type="number" name="planned_distance" required min="1" value={formData.planned_distance} onChange={handleInputChange} className="w-full rounded-xl border border-[#D8C9A7]/70 bg-[#F6F5F2] p-2.5 outline-none dark:border-[#3B433D] dark:bg-[#1F2421] dark:text-[#F5F5F5]" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#6B6B6B] transition-all hover:bg-gray-100 dark:hover:bg-[#1F2421]">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-[#6E8B3D] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5F7633]">
                  Save Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}