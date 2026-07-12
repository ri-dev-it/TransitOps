const pool = require('../config/db');

async function listFuelLogs(req, res) {
  try {
    const { vehicle_id } = req.query;
    const clauses = [];
    const values = [];
    if (vehicle_id) {
      values.push(vehicle_id);
      clauses.push(`vehicle_id = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(`SELECT * FROM fuel_logs ${where} ORDER BY log_date DESC`, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch fuel logs.' });
  }
}

async function createFuelLog(req, res) {
  try {
    const { vehicle_id, trip_id, liters, cost, log_date } = req.body;
    if (!vehicle_id || !liters || cost === undefined) {
      return res.status(400).json({ message: 'vehicle_id, liters and cost are required.' });
    }
    if (Number(liters) <= 0 || Number(cost) < 0) {
      return res.status(400).json({ message: 'liters must be > 0 and cost must be >= 0.' });
    }

    const vehicleCheck = await pool.query('SELECT id FROM vehicles WHERE id = $1', [vehicle_id]);
    if (!vehicleCheck.rows[0]) return res.status(404).json({ message: 'Vehicle not found.' });

    const result = await pool.query(
      `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE)) RETURNING *`,
      [vehicle_id, trip_id || null, liters, cost, log_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create fuel log.' });
  }
}

module.exports = { listFuelLogs, createFuelLog };
