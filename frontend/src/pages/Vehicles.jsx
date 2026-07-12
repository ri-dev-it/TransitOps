import { mockVehicles } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Vehicles() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Fleet</p>
        <h1 className="mt-2 text-3xl font-semibold">Vehicles</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockVehicles.map((vehicle) => (
          <div key={vehicle.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{vehicle.registration}</p>
                <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{vehicle.name}</p>
              </div>
              <StatusBadge status={vehicle.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[#6B6B6B] dark:text-[#B4B4B4]">Type</p><p className="font-semibold">{vehicle.type}</p></div>
              <div><p className="text-[#6B6B6B] dark:text-[#B4B4B4]">Capacity</p><p className="font-semibold">{vehicle.capacity}</p></div>
              <div><p className="text-[#6B6B6B] dark:text-[#B4B4B4]">Odometer</p><p className="font-semibold">{vehicle.odometer}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
