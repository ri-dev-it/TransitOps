import { mockMaintenance } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Maintenance() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Maintenance</p>
        <h1 className="mt-2 text-3xl font-semibold">Maintenance</h1>
      </div>
      <div className="space-y-3">
        {mockMaintenance.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{item.vehicle}</p>
                <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{item.issue}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={item.status} />
                <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
