export default function StatusBadge({ status }) {
  const colorMap = {
    Dispatched: 'bg-[#D9E6A7] text-[#2A2A2A]',
    Planned: 'bg-[#F2E6C8] text-[#2A2A2A]',
    Completed: 'bg-[#DDE7D8] text-[#2A2A2A]',
    'In Progress': 'bg-[#E4C980] text-[#2A2A2A]',
    Scheduled: 'bg-[#F2E6C8] text-[#2A2A2A]',
    Resolved: 'bg-[#DDE7D8] text-[#2A2A2A]',
    'On Duty': 'bg-[#D9E6A7] text-[#2A2A2A]',
    Available: 'bg-[#DDE7D8] text-[#2A2A2A]',
    'On Route': 'bg-[#E4C980] text-[#2A2A2A]',
    Maintenance: 'bg-[#F2C9C2] text-[#2A2A2A]',
    Resting: 'bg-[#D8C9A7] text-[#2A2A2A]',
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colorMap[status] || 'bg-[#F6F5F2] text-[#2A2A2A]'}`}>{status}</span>;
}
