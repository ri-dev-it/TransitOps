const pool = require('../config/db');

async function buildVehicleReport() {
  const result = await pool.query(`
    SELECT
      v.id,
      v.registration_number,
      v.name,
      v.type,
      v.status,
      v.acquisition_cost,
      COALESCE(trip_agg.total_distance, 0) AS total_distance,
      COALESCE(fuel_agg.total_liters, 0) AS total_fuel_liters,
      COALESCE(fuel_agg.total_fuel_cost, 0) AS total_fuel_cost,
      COALESCE(maint_agg.total_maintenance_cost, 0) AS total_maintenance_cost,
      COALESCE(expense_agg.total_expenses, 0) AS total_other_expenses,
      COALESCE(trip_agg.total_revenue, 0) AS total_revenue
    FROM vehicles v
    LEFT JOIN (
      SELECT vehicle_id, SUM(actual_distance) AS total_distance, SUM(revenue) AS total_revenue
      FROM trips WHERE status = 'Completed' GROUP BY vehicle_id
    ) trip_agg ON trip_agg.vehicle_id = v.id
    LEFT JOIN (
      SELECT vehicle_id, SUM(liters) AS total_liters, SUM(cost) AS total_fuel_cost
      FROM fuel_logs GROUP BY vehicle_id
    ) fuel_agg ON fuel_agg.vehicle_id = v.id
    LEFT JOIN (
      SELECT vehicle_id, SUM(cost) AS total_maintenance_cost
      FROM maintenance_logs GROUP BY vehicle_id
    ) maint_agg ON maint_agg.vehicle_id = v.id
    LEFT JOIN (
      SELECT vehicle_id, SUM(amount) AS total_expenses
      FROM expenses GROUP BY vehicle_id
    ) expense_agg ON expense_agg.vehicle_id = v.id
    ORDER BY v.id
  `);

  return result.rows.map((row) => {
    const totalDistance = Number(row.total_distance);
    const totalFuelLiters = Number(row.total_fuel_liters);
    const fuelEfficiency = totalFuelLiters > 0 ? Number((totalDistance / totalFuelLiters).toFixed(2)) : 0;

    const operationalCost = Number(row.total_fuel_cost) + Number(row.total_maintenance_cost) + Number(row.total_other_expenses);
    const revenue = Number(row.total_revenue);
    const acquisitionCost = Number(row.acquisition_cost) || 1; // avoid divide-by-zero
    const roi = Number((((revenue - (Number(row.total_maintenance_cost) + Number(row.total_fuel_cost))) / acquisitionCost) * 100).toFixed(2));

    return {
      vehicle_id: row.id,
      registration_number: row.registration_number,
      name: row.name,
      type: row.type,
      status: row.status,
      total_distance_km: totalDistance,
      total_fuel_liters: totalFuelLiters,
      fuel_efficiency_km_per_liter: fuelEfficiency,
      total_fuel_cost: Number(row.total_fuel_cost),
      total_maintenance_cost: Number(row.total_maintenance_cost),
      total_other_expenses: Number(row.total_other_expenses),
      operational_cost: Number(operationalCost.toFixed(2)),
      revenue,
      roi_percent: roi,
    };
  });
}

async function getVehicleReports(req, res) {
  try {
    const report = await buildVehicleReport();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to build report.' });
  }
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(','));
  }
  return lines.join('\n');
}

async function exportVehicleReportsCsv(req, res) {
  try {
    const report = await buildVehicleReport();
    const csv = toCsv(report);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transitops-report.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export CSV.' });
  }
}

module.exports = { getVehicleReports, exportVehicleReportsCsv };
