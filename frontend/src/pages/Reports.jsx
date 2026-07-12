import { mockReportCards, mockReports } from '../utils/mockData';

export default function Reports() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">Reports</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {mockReportCards.map((card) => (
          <div key={card.title} className="card p-5">
            <p className="text-lg font-semibold">{card.title}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{card.delta}</p>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Operational performance</h2>
        <div className="mt-4 space-y-3">
          {mockReports.map((report) => (
            <div key={report.label} className="flex items-center justify-between rounded-2xl bg-[#F6F5F2] px-4 py-3 dark:bg-[#1F2421]">
              <span className="font-semibold">{report.label}</span>
              <div className="flex items-center gap-3">
                <span>{report.value}</span>
                <span className="text-sm text-[#6E8B3D]">{report.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
