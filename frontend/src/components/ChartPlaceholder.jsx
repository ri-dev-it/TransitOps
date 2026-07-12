export default function ChartPlaceholder({ title, subtitle }) {
  return (
    <div className="card flex h-full min-h-[320px] flex-col p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{subtitle}</p>
      </div>
      <div className="flex flex-1 items-end justify-between gap-2 rounded-2xl border border-[#D8C9A7]/60 bg-[linear-gradient(180deg,#FCFAF7_0%,#F6F5F2_100%)] p-4 dark:border-[#3B433D] dark:bg-[#1F2421]">
        {[48, 72, 56, 84, 64, 92].map((height, index) => (
          <div key={index} className="flex-1 rounded-t-xl bg-[var(--accent)]" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}
