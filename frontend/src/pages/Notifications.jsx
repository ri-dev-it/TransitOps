import { mockNotifications } from '../utils/mockData';

export default function Notifications() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Signals</p>
        <h1 className="mt-2 text-3xl font-semibold">Notifications</h1>
      </div>
      <div className="space-y-3">
        {mockNotifications.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{item.message}</p>
              </div>
              <div className="text-right text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">
                <p>{item.time}</p>
                <p className="mt-1 font-semibold text-[var(--accent)]">{item.priority}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
