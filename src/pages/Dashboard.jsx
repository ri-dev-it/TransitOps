import StatCard from '../components/StatCard';
import ChartPlaceholder from '../components/ChartPlaceholder';
import { dashboardKpis, mockDrivers, mockMaintenance, mockTrips } from '../utils/mockData';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Operations overview</p>
          <h1 className="mt-2 text-3xl font-semibold">Smart Transport Operations Platform</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">A premium front-end foundation for fleet visibility, dispatch coordination, maintenance oversight, and cost control.</p>
        </div>
        <div className="rounded-full bg-[#F6F5F2] px-4 py-2 text-sm font-medium text-[#2A2A2A] dark:bg-[#1F2421] dark:text-[#F5F5F5]">Updated 2 min ago</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} hint={item.change} accent={item.label === 'Active Trips' || item.label === 'Fleet Utilization'} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPlaceholder title="Fleet utilization" subtitle="Capacity versus active routes" />
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fuel analytics</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Cost efficiency by lane and asset</p>
            </div>
            <div className="rounded-full bg-[#D8C9A7]/60 px-3 py-1 text-sm font-medium text-[#2A2A2A] dark:bg-[#D8C9A7]/20 dark:text-[#EADDC2]">Q3 focus</div>
          </div>
          <div className="space-y-3">
            {['TR-204', 'TR-221', 'TR-407'].map((vehicle, index) => (
              <div key={vehicle} className="flex items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421]">
                <div>
                  <p className="font-semibold">{vehicle}</p>
                  <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{['Best efficiency', 'Stabilizing', 'Watch cost'][index]}</p>
                </div>
                <p className="text-sm font-semibold text-[#6E8B3D]">{['8.4 km/L', '7.1 km/L', '6.8 km/L'][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent trips</h3>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Live dispatch snapshot</p>
            </div>
            <button className="rounded-full bg-[#6E8B3D] px-3 py-2 text-sm font-semibold text-white">View all</button>
          </div>
          <div className="space-y-3">
            {mockTrips.map((trip) => (
              <div key={trip.id} className="flex flex-wrap items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421]">
                <div>
                  <p className="font-semibold">{trip.route}</p>
                  <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{trip.vehicle} • {trip.driver}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{trip.eta}</span>
                  <StatusBadge status={trip.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Maintenance alerts</h3>
              <span className="rounded-full bg-[#D8C9A7]/60 px-3 py-1 text-sm font-medium">3 pending</span>
            </div>
            <div className="space-y-2">
              {mockMaintenance.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#F6F5F2] px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:bg-[#1F2421]">
                  <div>
                    <p className="font-semibold">{item.vehicle}</p>
                    <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{item.issue}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Driver status</h3>
              <span className="text-sm text-[#6E8B3D]">18 active</span>
            </div>
            <div className="space-y-2">
              {mockDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between rounded-2xl border border-[#D8C9A7]/60 bg-[#FCFAF7] px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm dark:border-[#3B433D] dark:bg-[#1F2421]">
                  <div>
                    <p className="font-semibold">{driver.driver}</p>
                    <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">{driver.license}</p>
                  </div>
                  <StatusBadge status={driver.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick actions</h3>
            <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Jump into the most common operations tasks</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-[#6E8B3D] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5F7633] hover:shadow-md active:scale-[0.98]">Create trip</button>
          <button className="rounded-full border border-[#D8C9A7] bg-[#D8C9A7]/70 px-4 py-2 text-sm font-semibold text-[#2A2A2A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]">Add maintenance</button>
          <button className="rounded-full border border-[#D8C9A7] bg-white px-4 py-2 text-sm font-semibold text-[#2A2A2A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] dark:bg-[#1F2421]">Review reports</button>
        </div>
      </div>
    </div>
  );
}
