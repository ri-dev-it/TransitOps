const pool = require('../config/db');

async function getTrips(req, res) {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
}

async function createTrip(req, res) {
  try {
    const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
    const result = await pool.query(
      `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Draft') RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create trip' });
  }
}

async function dispatchTrip(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const trip = (await client.query('SELECT * FROM trips WHERE id = $1', [id])).rows[0];
    
    // Update statuses to 'On Trip'
    await client.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['On Trip', trip.vehicle_id]);
    await client.query('UPDATE drivers SET status = $1 WHERE id = $2', ['On Trip', trip.driver_id]);
    await client.query('UPDATE trips SET status = $1 WHERE id = $2', ['Dispatched', id]);
    
    await client.query('COMMIT');
    res.json({ message: 'Trip dispatched' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally { client.release(); }
}

async function completeTrip(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const trip = (await client.query('SELECT * FROM trips WHERE id = $1', [id])).rows[0];
    
    // Restore statuses to 'Available'
    await client.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['Available', trip.vehicle_id]);
    await client.query('UPDATE drivers SET status = $1 WHERE id = $2', ['Available', trip.driver_id]);
    await client.query('UPDATE trips SET status = $1 WHERE id = $2', ['Completed', id]);
    
    await client.query('COMMIT');
    res.json({ message: 'Trip completed' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally { client.release(); }
}

async function cancelTrip(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const trip = (await client.query('SELECT * FROM trips WHERE id = $1', [id])).rows[0];
    
    // Cancelled trip restores vehicle and driver to 'Available'
    if (trip.status === 'Dispatched') {
      await client.query('UPDATE vehicles SET status = $1 WHERE id = $2', ['Available', trip.vehicle_id]);
      await client.query('UPDATE drivers SET status = $1 WHERE id = $2', ['Available', trip.driver_id]);
    }
    
    await client.query('UPDATE trips SET status = $1 WHERE id = $2', ['Cancelled', id]);
    await client.query('COMMIT');
    res.json({ message: 'Trip cancelled and assets released' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally { client.release(); }
}

module.exports = { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip };