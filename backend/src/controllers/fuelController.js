const pool = require('../config/db');

async function getFuelLogs(req, res) {
  try {
    const result = await pool.query(`
      SELECT f.*, v.registration_number 
      FROM fuel_logs f 
      JOIN vehicles v ON f.vehicle_id = v.id 
      ORDER BY f.date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fuel logs.' });
  }
}

async function createFuelLog(req, res) {
  try {
    const { vehicle_id, liters, cost, date } = req.body;
    const result = await pool.query(
      `INSERT INTO fuel_logs (vehicle_id, liters, cost, date) VALUES ($1, $2, $3, $4) RETURNING *`,
      [vehicle_id, liters, cost, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create fuel log.' });
  }
}

module.exports = { getFuelLogs, createFuelLog };