const pool = require('../config/db');

const STATUS_VALUES = ['Available', 'On Trip', 'In Shop', 'Retired'];

async function listVehicles(req, res) {
  try {
    const { status, type, region, dispatchable } = req.query;
    const clauses = [];
    const values = [];

    if (status) {
      values.push(status);
      clauses.push(`status = $${values.length}`);
    }
    if (type) {
      values.push(type);
      clauses.push(`type = $${values.length}`);
    }
    if (region) {
      values.push(region);
      clauses.push(`region = $${values.length}`);
    }
    // Rule: Retired or In Shop vehicles must never appear in the dispatch selection.
    if (dispatchable === 'true') {
      clauses.push(`status = 'Available'`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT * FROM vehicles ${where} ORDER BY created_at DESC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch vehicles.' });
  }
}

async function getVehicle(req, res) {
  try {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Vehicle not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch vehicle.' });
  }
}

async function createVehicle(req, res) {
  try {
    const { registration_number, name, type, max_load_capacity, odometer, acquisition_cost, region } = req.body;

    if (!registration_number || !name || !type || !max_load_capacity) {
      return res.status(400).json({
        message: 'registration_number, name, type and max_load_capacity are required.',
      });
    }
    if (Number(max_load_capacity) <= 0) {
      return res.status(400).json({ message: 'max_load_capacity must be greater than 0.' });
    }

    const dup = await pool.query('SELECT id FROM vehicles WHERE registration_number = $1', [registration_number]);
    if (dup.rows.length) {
      return res.status(409).json({ message: 'A vehicle with this registration number already exists.' });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (registration_number, name, type, max_load_capacity, odometer, acquisition_cost, region)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [registration_number, name, type, max_load_capacity, odometer || 0, acquisition_cost || 0, region || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Registration number must be unique.' });
    }
    res.status(500).json({ message: 'Failed to create vehicle.' });
  }
}

async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const { name, type, max_load_capacity, odometer, acquisition_cost, status, region } = req.body;

    if (status && !STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${STATUS_VALUES.join(', ')}` });
    }

    const existing = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Vehicle not found.' });

    const result = await pool.query(
      `UPDATE vehicles SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        max_load_capacity = COALESCE($3, max_load_capacity),
        odometer = COALESCE($4, odometer),
        acquisition_cost = COALESCE($5, acquisition_cost),
        status = COALESCE($6, status),
        region = COALESCE($7, region),
        updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, type, max_load_capacity, odometer, acquisition_cost, status, region, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update vehicle.' });
  }
}

async function deleteVehicle(req, res) {
  try {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Vehicle not found.' });
    res.json({ message: 'Vehicle deleted.' });
  } catch (err) {
    console.error(err);
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Cannot delete vehicle with linked trips/maintenance/fuel records.' });
    }
    res.status(500).json({ message: 'Failed to delete vehicle.' });
  }
}

module.exports = { listVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
