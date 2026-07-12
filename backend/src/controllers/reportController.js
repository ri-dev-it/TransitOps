const pool = require('../config/db');

async function getReports(req, res) {
  try {
    const query = `
      SELECT 
        v.id,
        v.registration_number,
        v.acquisition_cost,
        COALESCE((SELECT SUM(planned_distance) FROM trips WHERE vehicle_id = v.id AND status = 'Completed'), 0) AS total_distance,
        COALESCE((SELECT SUM(liters) FROM fuel_logs WHERE vehicle_id = v.id), 0) AS total_fuel_liters,
        COALESCE((SELECT SUM(cost) FROM fuel_logs WHERE vehicle_id = v.id), 0) AS total_fuel_cost,
        COALESCE((SELECT SUM(cost) FROM maintenance_logs WHERE vehicle_id = v.id), 0) AS total_maintenance_cost
      FROM vehicles v
    `;
    const { rows } = await pool.query(query);

    const reports = rows.map(v => {
      // 1. Calculate Total Operational Cost (Fuel + Maintenance)
      const operationalCost = Number(v.total_fuel_cost) + Number(v.total_maintenance_cost);
      
      // 2. Calculate Fuel Efficiency (Distance / Fuel)
      const fuelEfficiency = v.total_fuel_liters > 0 
        ? (Number(v.total_distance) / Number(v.total_fuel_liters)).toFixed(2) 
        : 0;
      
      // 3. Mock Revenue ($5 per km driven) to satisfy ROI formula
      const revenue = Number(v.total_distance) * 5; 
      
      // 4. Calculate Vehicle ROI: (Revenue - (Maintenance + Fuel)) / Acquisition Cost[cite: 12]
      const roi = v.acquisition_cost > 0 
        ? ((revenue - operationalCost) / Number(v.acquisition_cost)).toFixed(4)
        : 0;

      return {
        registration_number: v.registration_number,
        operational_cost: operationalCost,
        fuel_efficiency: fuelEfficiency,
        revenue: revenue,
        roi: (roi * 100).toFixed(2) + '%'
      };
    });

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate reports.' });
  }
}

module.exports = { getReports };