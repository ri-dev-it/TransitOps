export default function StatCard({ label, value, hint, accent = false }) {
  return (
    <div className="rounded-3xl border border-[#D8C9A7]/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-[#3B433D] dark:bg-[#242826]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6B6B] dark:text-[#B4B4B4]">{label}</p>
      <p className={`text-3xl font-semibold ${accent ? 'text-[#6E8B3D]' : 'text-[#2A2A2A] dark:text-[#F5F5F5]'}`}>
        {value}
      </p>
      {hint && <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{hint}</p>}
    </div>
  );
}
