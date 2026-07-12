const pool = require('../config/db');

async function getKpis(req, res) {
  try {
    const { type, status, region } = req.query;
    const vClauses = [];
    const vValues = [];
    
    if (type) {
      vValues.push(type);
      vClauses.push(`type = $${vValues.length}`);
    }
    if (status) {
      vValues.push(status);
      vClauses.push(`status = $${vValues.length}`);
    }
    if (region) {
      vValues.push(region);
      vClauses.push(`region = $${vValues.length}`);
    }
    
    const vWhere = vClauses.length ? `WHERE ${vClauses.join(' AND ')}` : '';

    const vehicleStats = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status != 'Retired')::int AS active_vehicles,
        COUNT(*) FILTER (WHERE status = 'Available')::int AS available_vehicles,
        COUNT(*) FILTER (WHERE status = 'In Shop')::int AS vehicles_in_maintenance,
        COUNT(*)::int AS total_vehicles
       FROM vehicles ${vWhere}`,
      vValues
    );

    const tripStats = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'Dispatched')::int AS active_trips,
        COUNT(*) FILTER (WHERE status = 'Draft')::int AS pending_trips
       FROM trips`
    );

    const driverStats = await pool.query(
      `SELECT COUNT(*) FILTER (WHERE status = 'On Trip')::int AS drivers_on_duty FROM drivers`
    );

    const v = vehicleStats.rows[0];
    const t = tripStats.rows[0];
    const d = driverStats.rows[0];

    const utilization = v.total_vehicles > 0
      ? Number(((v.total_vehicles - v.available_vehicles - v.vehicles_in_maintenance) / v.total_vehicles) * 100).toFixed(2)
      : '0.00';

    res.json({
      active_vehicles: v.active_vehicles,
      available_vehicles: v.available_vehicles,
      vehicles_in_maintenance: v.vehicles_in_maintenance,
      active_trips: t.active_trips,
      pending_trips: t.pending_trips,
      drivers_on_duty: d.drivers_on_duty,
      fleet_utilization_percent: Number(utilization),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch KPIs.' });
  }
}

// This export must exactly match what you require in the routes file
module.exports = { getKpis };