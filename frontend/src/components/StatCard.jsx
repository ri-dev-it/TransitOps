export default function StatCard({ label, value, suffix = '', accent = false }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-ink-700 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-mono font-semibold ${accent ? 'text-signal-600' : 'text-ink-900'}`}>
        {value}
        <span className="text-base ml-0.5">{suffix}</span>
      </p>
    </div>
  );
}
