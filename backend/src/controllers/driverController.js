const pool = require('../config/db');

const STATUS_VALUES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

async function listDrivers(req, res) {
  try {
    const { status, region, dispatchable } = req.query;
    const clauses = [];
    const values = [];

    if (status) {
      values.push(status);
      clauses.push(`status = $${values.length}`);
    }
    if (region) {
      values.push(region);
      clauses.push(`region = $${values.length}`);
    }
    // Rule: Drivers with expired licenses or Suspended status cannot be assigned to trips.
    if (dispatchable === 'true') {
      clauses.push(`status = 'Available'`);
      clauses.push(`license_expiry_date >= CURRENT_DATE`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(`SELECT * FROM drivers ${where} ORDER BY created_at DESC`, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch drivers.' });
  }
}

async function getDriver(req, res) {
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Driver not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch driver.' });
  }
}

async function createDriver(req, res) {
  try {
    const { name, license_number, license_category, license_expiry_date, contact_number, safety_score, region } = req.body;

    if (!name || !license_number || !license_category || !license_expiry_date || !contact_number) {
      return res.status(400).json({
        message: 'name, license_number, license_category, license_expiry_date and contact_number are required.',
      });
    }
    if (isNaN(Date.parse(license_expiry_date))) {
      return res.status(400).json({ message: 'license_expiry_date must be a valid date.' });
    }

    const dup = await pool.query('SELECT id FROM drivers WHERE license_number = $1', [license_number]);
    if (dup.rows.length) {
      return res.status(409).json({ message: 'A driver with this license number already exists.' });
    }

    const result = await pool.query(
      `INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, region)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, license_number, license_category, license_expiry_date, contact_number, safety_score || 100, region || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ message: 'License number must be unique.' });
    }
    res.status(500).json({ message: 'Failed to create driver.' });
  }
}

async function updateDriver(req, res) {
  try {
    const { id } = req.params;
    const { name, license_category, license_expiry_date, contact_number, safety_score, status, region } = req.body;

    if (status && !STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${STATUS_VALUES.join(', ')}` });
    }

    const existing = await pool.query('SELECT * FROM drivers WHERE id = $1', [id]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Driver not found.' });

    const result = await pool.query(
      `UPDATE drivers SET
        name = COALESCE($1, name),
        license_category = COALESCE($2, license_category),
        license_expiry_date = COALESCE($3, license_expiry_date),
        contact_number = COALESCE($4, contact_number),
        safety_score = COALESCE($5, safety_score),
        status = COALESCE($6, status),
        region = COALESCE($7, region),
        updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, license_category, license_expiry_date, contact_number, safety_score, status, region, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update driver.' });
  }
}

async function deleteDriver(req, res) {
  try {
    const result = await pool.query('DELETE FROM drivers WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Driver not found.' });
    res.json({ message: 'Driver deleted.' });
  } catch (err) {
    console.error(err);
    if (err.code === '23503') {
      return res.status(409).json({ message: 'Cannot delete driver with linked trips.' });
    }
    res.status(500).json({ message: 'Failed to delete driver.' });
  }
}

module.exports = { listDrivers, getDriver, createDriver, updateDriver, deleteDriver };
