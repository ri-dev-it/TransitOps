import { mockDrivers } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Drivers() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Team</p>
        <h1 className="mt-2 text-3xl font-semibold">Drivers</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {mockDrivers.map((driver) => (
          <div key={driver.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{driver.driver}</p>
                <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{driver.license}</p>
              </div>
              <StatusBadge status={driver.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[#6B6B6B] dark:text-[#B4B4B4]">Safety score</p><p className="font-semibold">{driver.safetyScore}</p></div>
              <div><p className="text-[#6B6B6B] dark:text-[#B4B4B4]">Expiry</p><p className="font-semibold">{driver.expiry}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
