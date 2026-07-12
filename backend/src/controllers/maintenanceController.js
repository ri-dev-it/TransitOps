const pool = require('../config/db');

async function listMaintenance(req, res) {
  try {
    const { vehicle_id, status } = req.query;
    const clauses = [];
    const values = [];
    if (vehicle_id) {
      values.push(vehicle_id);
      clauses.push(`m.vehicle_id = $${values.length}`);
    }
    if (status) {
      values.push(status);
      clauses.push(`m.status = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT m.*, v.registration_number, v.name AS vehicle_name
       FROM maintenance_logs m JOIN vehicles v ON v.id = m.vehicle_id
       ${where} ORDER BY m.created_at DESC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch maintenance logs.' });
  }
}

// Creating an active maintenance record automatically changes vehicle status to In Shop.
async function createMaintenance(req, res) {
  const client = await pool.connect();
  try {
    const { vehicle_id, service_type, description, cost } = req.body;
    if (!vehicle_id || !service_type) {
      return res.status(400).json({ message: 'vehicle_id and service_type are required.' });
    }

    await client.query('BEGIN');
    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [vehicle_id]);
    const vehicle = vehicleRes.rows[0];
    if (!vehicle) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    if (vehicle.status === 'On Trip') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cannot log maintenance while the vehicle is On Trip.' });
    }

    const logRes = await client.query(
      `INSERT INTO maintenance_logs (vehicle_id, service_type, description, cost, status)
       VALUES ($1,$2,$3,$4,'Open') RETURNING *`,
      [vehicle_id, service_type, description || null, cost || 0]
    );

    if (vehicle.status !== 'Retired') {
      await client.query(`UPDATE vehicles SET status = 'In Shop', updated_at = NOW() WHERE id = $1`, [vehicle_id]);
    }

    await client.query('COMMIT');
    res.status(201).json(logRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to create maintenance record.' });
  } finally {
    client.release();
  }
}

// Closing maintenance restores the vehicle to Available (unless retired).
async function closeMaintenance(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { cost } = req.body;

    await client.query('BEGIN');
    const logRes = await client.query('SELECT * FROM maintenance_logs WHERE id = $1 FOR UPDATE', [id]);
    const log = logRes.rows[0];
    if (!log) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Maintenance record not found.' });
    }
    if (log.status === 'Closed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Maintenance record is already closed.' });
    }

    const updatedLog = await client.query(
      `UPDATE maintenance_logs SET status = 'Closed', cost = COALESCE($2, cost), closed_at = NOW() WHERE id = $1 RETURNING *`,
      [id, cost]
    );

    // Only restore to Available if there are no other Open maintenance records for this vehicle
    const otherOpen = await client.query(
      `SELECT COUNT(*)::int AS count FROM maintenance_logs WHERE vehicle_id = $1 AND status = 'Open' AND id != $2`,
      [log.vehicle_id, id]
    );
    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [log.vehicle_id]);
    const vehicle = vehicleRes.rows[0];

    if (otherOpen.rows[0].count === 0 && vehicle.status !== 'Retired') {
      await client.query(`UPDATE vehicles SET status = 'Available', updated_at = NOW() WHERE id = $1`, [log.vehicle_id]);
    }

    await client.query('COMMIT');
    res.json(updatedLog.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to close maintenance record.' });
  } finally {
    client.release();
  }
}

module.exports = { listMaintenance, createMaintenance, closeMaintenance };
