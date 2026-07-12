import { mockTrips } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Trips() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Dispatch</p>
        <h1 className="mt-2 text-3xl font-semibold">Trips</h1>
      </div>
      <div className="space-y-3">
        {mockTrips.map((trip) => (
          <div key={trip.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{trip.route}</p>
                <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{trip.vehicle} • {trip.driver} • {trip.cargo}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{trip.eta}</span>
                <StatusBadge status={trip.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
