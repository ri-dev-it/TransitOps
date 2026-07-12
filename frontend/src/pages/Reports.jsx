import { useState, useEffect } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // CSV Export Functionality[cite: 12]
  const exportToCSV = () => {
    const headers = ['Vehicle Registration', 'Operational Cost ($)', 'Fuel Efficiency (km/L)', 'Est. Revenue ($)', 'Vehicle ROI (%)'];
    const rows = reports.map(r => [
      r.registration_number, 
      r.operational_cost, 
      r.fuel_efficiency, 
      r.revenue, 
      r.roi
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TransitOps_Fleet_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-[#6B6B6B]">Aggregating financial data...</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-[#6B6B6B] dark:text-[#B4B4B4]">
            Review operational expenses, fuel consumption, maintenance costs, and profitability.
          </p>
        </div>
        <button 
          onClick={exportToCSV}
          className="rounded-full border border-[#6E8B3D] text-[#6E8B3D] px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[#6E8B3D] hover:text-white"
        >
          Export to CSV
        </button>
      </div>

      <div className="card overflow-hidden rounded-3xl border border-[#D8C9A7]/70 bg-white shadow-sm dark:border-[#3B433D] dark:bg-[#242826]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F5F2] text-[#6B6B6B] dark:bg-[#1F2421] dark:text-[#B4B4B4]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total Operational Cost</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Fuel Efficiency</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Est. Revenue</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Vehicle ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C9A7]/30 dark:divide-[#3B433D]/50">
              {reports.map((report, index) => (
                <tr key={index} className="transition-colors hover:bg-[#FCFAF7] dark:hover:bg-[#1F2421]">
                  <td className="px-6 py-4 font-medium">{report.registration_number}</td>
                  <td className="px-6 py-4 text-red-600">${report.operational_cost.toFixed(2)}</td>
                  <td className="px-6 py-4">{report.fuel_efficiency} km/L</td>
                  <td className="px-6 py-4 text-green-600">${report.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 font-semibold">{report.roi}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#6B6B6B]">
                    No reporting data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}