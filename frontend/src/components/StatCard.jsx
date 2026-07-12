export default function StatCard({ label, value, hint, accent = false }) {
  return (
    <div className="flex min-h-[132px] flex-col justify-between rounded-2xl border border-[#D8C9A7]/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-[#3B433D] dark:bg-[#242826]">
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-[11rem] text-sm font-semibold uppercase tracking-[0.12em] text-[#6B6B6B] dark:text-[#B4B4B4]">
          {label}
        </p>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            accent ? 'bg-[var(--accent)]' : 'bg-[#D8C9A7]'
          }`}
        />
      </div>

      <div>
        <p className="text-3xl font-semibold leading-tight text-[#2A2A2A] dark:text-[#F5F5F5]">
          {value ?? 0}
        </p>
        <p className="mt-1 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{hint}</p>
      </div>
    </div>
  );
}
