const COLOR_MAP = {
  Available: 'bg-emerald-100 text-emerald-700',
  'On Trip': 'bg-amber-100 text-amber-700',
  'In Shop': 'bg-orange-100 text-orange-700',
  Retired: 'bg-mist-200 text-ink-700',
  'Off Duty': 'bg-mist-200 text-ink-700',
  Suspended: 'bg-red-100 text-red-700',
  Draft: 'bg-mist-200 text-ink-700',
  Dispatched: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
  Open: 'bg-orange-100 text-orange-700',
  Closed: 'bg-emerald-100 text-emerald-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${COLOR_MAP[status] || 'bg-mist-200 text-ink-700'}`}>{status}</span>
  );
}
