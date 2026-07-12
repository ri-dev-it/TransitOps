const pool = require('../config/db');

// Get all drivers
async function getAllDrivers(req, res) {
  try {
    const result = await pool.query('SELECT * FROM drivers ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch drivers.' });
  }
}

// Create a new driver
async function createDriver(req, res) {
  try {
    const { name, license_number, license_category, license_expiry_date, contact_number } = req.body;
    
    // Status defaults to 'Available', Safety Score defaults to 100[cite: 1]
    const result = await pool.query(
      `INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) 
       VALUES ($1, $2, $3, $4, $5, 100, 'Available') RETURNING *`,
      [name, license_number, license_category, license_expiry_date, contact_number]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    // Handle unique constraint violation for license number
    if (err.code === '23505') {
      return res.status(400).json({ message: 'License number must be unique.' });
    }
    res.status(500).json({ message: 'Failed to create driver.' });
  }
}

// Update driver status
async function updateDriverStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Status must be one of: Available, On Trip, Off Duty, Suspended[cite: 1]
    const result = await pool.query(
      'UPDATE drivers SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Driver not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update driver status.' });
  }
}

// These exports must exactly match the destructuring in driverRoutes.js
module.exports = { getAllDrivers, createDriver, updateDriverStatus };