import { useEffect, useState } from 'react';
import api from '../api/axios';

const EMPTY_FUEL = { vehicle_id: '', liters: '', cost: '', log_date: '' };
const EMPTY_EXPENSE = { vehicle_id: '', category: 'Toll', description: '', amount: '', expense_date: '' };

export default function Fuel() {
  const [vehicles, setVehicles] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [fuelForm, setFuelForm] = useState(EMPTY_FUEL);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [vehiclesRes, fuelRes, expenseRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/fuel-logs'),
        api.get('/expenses'),
      ]);
      setVehicles(vehiclesRes.data);
      setFuelLogs(fuelRes.data);
      setExpenses(expenseRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function submitFuel(e) {
    e.preventDefault();
    setError('');
    if (!fuelForm.vehicle_id || !fuelForm.liters || fuelForm.cost === '') {
      setError('Vehicle, liters and cost are required for fuel logs.');
      return;
    }
    try {
      await api.post('/fuel-logs', {
        ...fuelForm,
        liters: Number(fuelForm.liters),
        cost: Number(fuelForm.cost),
        log_date: fuelForm.log_date || undefined,
      });
      setFuelForm(EMPTY_FUEL);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log fuel entry.');
    }
  }

  async function submitExpense(e) {
    e.preventDefault();
    setError('');
    if (!expenseForm.vehicle_id || !expenseForm.category || expenseForm.amount === '') {
      setError('Vehicle, category and amount are required for expenses.');
      return;
    }
    try {
      await api.post('/expenses', {
        ...expenseForm,
        amount: Number(expenseForm.amount),
        expense_date: expenseForm.expense_date || undefined,
      });
      setExpenseForm(EMPTY_EXPENSE);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log expense.');
    }
  }

  function regFor(id) {
    return vehicles.find((v) => v.id === id)?.registration_number || `#${id}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-1">Fuel & Expense Management</h1>
      <p className="text-sm text-ink-700 mb-4">Total operational cost = Fuel + Maintenance, computed per vehicle in Reports.</p>

      {error && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-md px-3 py-2">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <form onSubmit={submitFuel} className="card p-4 space-y-3">
          <h2 className="font-semibold text-sm">Log Fuel Entry</h2>
          <select className="input-field" value={fuelForm.vehicle_id}
            onChange={(e) => setFuelForm((f) => ({ ...f, vehicle_id: e.target.value }))}>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registration_number} — {v.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" type="number" placeholder="Liters" value={fuelForm.liters}
              onChange={(e) => setFuelForm((f) => ({ ...f, liters: e.target.value }))} />
            <input className="input-field" type="number" placeholder="Cost (₹)" value={fuelForm.cost}
              onChange={(e) => setFuelForm((f) => ({ ...f, cost: e.target.value }))} />
          </div>
          <input className="input-field" type="date" value={fuelForm.log_date}
            onChange={(e) => setFuelForm((f) => ({ ...f, log_date: e.target.value }))} />
          <button type="submit" className="btn-primary w-full">Add Fuel Log</button>
        </form>

        <form onSubmit={submitExpense} className="card p-4 space-y-3">
          <h2 className="font-semibold text-sm">Log Expense (toll, misc.)</h2>
          <select className="input-field" value={expenseForm.vehicle_id}
            onChange={(e) => setExpenseForm((f) => ({ ...f, vehicle_id: e.target.value }))}>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registration_number} — {v.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <select className="input-field" value={expenseForm.category}
              onChange={(e) => setExpenseForm((f) => ({ ...f, category: e.target.value }))}>
              <option value="Toll">Toll</option>
              <option value="Parking">Parking</option>
              <option value="Fine">Fine</option>
              <option value="Other">Other</option>
            </select>
            <input className="input-field" type="number" placeholder="Amount (₹)" value={expenseForm.amount}
              onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))} />
          </div>
          <input className="input-field" placeholder="Description (optional)" value={expenseForm.description}
            onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))} />
          <button type="submit" className="btn-secondary w-full">Add Expense</button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card overflow-x-auto">
          <h3 className="px-4 pt-3 text-sm font-semibold">Recent Fuel Logs</h3>
          <table className="w-full text-sm mt-2">
            <thead className="bg-mist-50 text-ink-700 text-xs uppercase">
              <tr><th className="text-left px-4 py-2">Vehicle</th><th className="text-left px-4 py-2">Liters</th><th className="text-left px-4 py-2">Cost</th><th className="text-left px-4 py-2">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {loading ? <tr><td colSpan={4} className="px-4 py-4 text-center text-ink-700">Loading…</td></tr> :
                fuelLogs.length === 0 ? <tr><td colSpan={4} className="px-4 py-4 text-center text-ink-700">No fuel logs yet.</td></tr> :
                fuelLogs.map((f) => (
                  <tr key={f.id}>
                    <td className="px-4 py-2 font-mono">{regFor(f.vehicle_id)}</td>
                    <td className="px-4 py-2 font-mono">{Number(f.liters).toFixed(1)} L</td>
                    <td className="px-4 py-2 font-mono">₹{Number(f.cost).toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(f.log_date).toLocaleDateString()}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card overflow-x-auto">
          <h3 className="px-4 pt-3 text-sm font-semibold">Recent Expenses</h3>
          <table className="w-full text-sm mt-2">
            <thead className="bg-mist-50 text-ink-700 text-xs uppercase">
              <tr><th className="text-left px-4 py-2">Vehicle</th><th className="text-left px-4 py-2">Category</th><th className="text-left px-4 py-2">Amount</th><th className="text-left px-4 py-2">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {loading ? <tr><td colSpan={4} className="px-4 py-4 text-center text-ink-700">Loading…</td></tr> :
                expenses.length === 0 ? <tr><td colSpan={4} className="px-4 py-4 text-center text-ink-700">No expenses logged yet.</td></tr> :
                expenses.map((ex) => (
                  <tr key={ex.id}>
                    <td className="px-4 py-2 font-mono">{regFor(ex.vehicle_id)}</td>
                    <td className="px-4 py-2">{ex.category}</td>
                    <td className="px-4 py-2 font-mono">₹{Number(ex.amount).toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(ex.expense_date).toLocaleDateString()}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
