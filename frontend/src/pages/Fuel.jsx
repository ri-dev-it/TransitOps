import { useMemo, useState } from 'react';
import { mockExpenses, mockFuelLogs } from '../utils/mockData';
import { formatCurrency } from '../utils/formatCurrency';

export default function Fuel() {
  const [search, setSearch] = useState('');

  const filteredFuel = useMemo(() => {
    return mockFuelLogs.filter((entry) => `${entry.vehicle} ${entry.date}`.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter((entry) => `${entry.vehicle} ${entry.category}`.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6E8B3D]">Fuel & expenses</p>
        <h1 className="mt-2 text-3xl font-semibold">Fuel & Expenses</h1>
        <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Monitor operating spend across the fleet with a lightweight financial view.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[#D8C9A7]/70 bg-white p-5 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
          <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Weekly fuel</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(443000)}</p>
        </div>
        <div className="rounded-[28px] border border-[#D8C9A7]/70 bg-white p-5 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
          <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Expense events</p>
          <p className="mt-2 text-3xl font-semibold">24</p>
        </div>
        <div className="rounded-[28px] border border-[#D8C9A7]/70 bg-white p-5 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
          <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Average cost per trip</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(62000)}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Fuel logs</h2>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Recent refuels and consumption.</p>
            </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input-field w-full max-w-48" placeholder="Search" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F6F5F2] text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6B6B] dark:bg-[#1F2421] dark:text-[#B4B4B4]">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Liters</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuel.map((entry) => (
                  <tr key={entry.id} className="border-t border-[#D8C9A7]/50 dark:border-[#3B433D]">
                    <td className="px-4 py-3 font-semibold">{entry.vehicle}</td>
                    <td className="px-4 py-3">{entry.liters} L</td>
                    <td className="px-4 py-3">{entry.cost}</td>
                    <td className="px-4 py-3">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#D8C9A7]/70 bg-white p-6 shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Expenses</h2>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">Tolls, parking, and service costs.</p>
            </div>
            <button className="rounded-full bg-[#6E8B3D] px-4 py-2 text-sm font-semibold text-white">Add expense</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F6F5F2] text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6B6B] dark:bg-[#1F2421] dark:text-[#B4B4B4]">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((entry) => (
                  <tr key={entry.id} className="border-t border-[#D8C9A7]/50 dark:border-[#3B433D]">
                    <td className="px-4 py-3 font-semibold">{entry.vehicle}</td>
                    <td className="px-4 py-3">{entry.category}</td>
                    <td className="px-4 py-3">{entry.amount}</td>
                    <td className="px-4 py-3">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
