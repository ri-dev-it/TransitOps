const pool = require('../config/db');

async function listTrips(req, res) {
  try {
    const { status, vehicle_id, driver_id } = req.query;
    const clauses = [];
    const values = [];

    if (status) {
      values.push(status);
      clauses.push(`t.status = $${values.length}`);
    }
    if (vehicle_id) {
      values.push(vehicle_id);
      clauses.push(`t.vehicle_id = $${values.length}`);
    }
    if (driver_id) {
      values.push(driver_id);
      clauses.push(`t.driver_id = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT t.*, v.registration_number, v.name AS vehicle_name, d.name AS driver_name
       FROM trips t
       JOIN vehicles v ON v.id = t.vehicle_id
       JOIN drivers d ON d.id = t.driver_id
       ${where}
       ORDER BY t.created_at DESC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trips.' });
  }
}

async function getTrip(req, res) {
  try {
    const result = await pool.query(
      `SELECT t.*, v.registration_number, v.name AS vehicle_name, d.name AS driver_name
       FROM trips t
       JOIN vehicles v ON v.id = t.vehicle_id
       JOIN drivers d ON d.id = t.driver_id
       WHERE t.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Trip not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trip.' });
  }
}

// Create a trip in Draft status. Validates vehicle/driver eligibility and cargo weight.
async function createTrip(req, res) {
  const client = await pool.connect();
  try {
    const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;

    if (!source || !destination || !vehicle_id || !driver_id || !cargo_weight || !planned_distance) {
      return res.status(400).json({
        message: 'source, destination, vehicle_id, driver_id, cargo_weight and planned_distance are required.',
      });
    }
    if (Number(cargo_weight) <= 0 || Number(planned_distance) <= 0) {
      return res.status(400).json({ message: 'cargo_weight and planned_distance must be greater than 0.' });
    }

    await client.query('BEGIN');

    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [vehicle_id]);
    const vehicle = vehicleRes.rows[0];
    if (!vehicle) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    if (vehicle.status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Vehicle is currently "${vehicle.status}" and cannot be assigned.` });
    }
    if (Number(cargo_weight) > Number(vehicle.max_load_capacity)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: `Cargo weight (${cargo_weight}kg) exceeds vehicle's maximum load capacity (${vehicle.max_load_capacity}kg).`,
      });
    }

    const driverRes = await client.query('SELECT * FROM drivers WHERE id = $1 FOR UPDATE', [driver_id]);
    const driver = driverRes.rows[0];
    if (!driver) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Driver not found.' });
    }
    if (driver.status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Driver is currently "${driver.status}" and cannot be assigned.` });
    }
    if (new Date(driver.license_expiry_date) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Driver license has expired and cannot be assigned to trips.' });
    }

    const tripRes = await client.query(
      `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,'Draft',$7) RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, req.user?.id || null]
    );

    await client.query('COMMIT');
    res.status(201).json(tripRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to create trip.' });
  } finally {
    client.release();
  }
}

// Draft -> Dispatched. Re-validates and locks in vehicle/driver as On Trip.
async function dispatchTrip(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');

    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
    const trip = tripRes.rows[0];
    if (!trip) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Trip not found.' });
    }
    if (trip.status !== 'Draft') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Only Draft trips can be dispatched. Current status: ${trip.status}.` });
    }

    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [trip.vehicle_id]);
    const vehicle = vehicleRes.rows[0];
    if (vehicle.status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Vehicle is "${vehicle.status}" and cannot be dispatched.` });
    }

    const driverRes = await client.query('SELECT * FROM drivers WHERE id = $1 FOR UPDATE', [trip.driver_id]);
    const driver = driverRes.rows[0];
    if (driver.status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Driver is "${driver.status}" and cannot be dispatched.` });
    }
    if (driver.status === 'Suspended' || new Date(driver.license_expiry_date) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Driver is suspended or license expired; cannot dispatch.' });
    }

    await client.query(`UPDATE vehicles SET status = 'On Trip', updated_at = NOW() WHERE id = $1`, [trip.vehicle_id]);
    await client.query(`UPDATE drivers SET status = 'On Trip', updated_at = NOW() WHERE id = $1`, [trip.driver_id]);
    const updated = await client.query(
      `UPDATE trips SET status = 'Dispatched', dispatched_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to dispatch trip.' });
  } finally {
    client.release();
  }
}

// Dispatched -> Completed. Records final odometer/fuel and frees vehicle/driver.
async function completeTrip(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { actual_distance, fuel_consumed, revenue } = req.body;

    if (actual_distance === undefined || fuel_consumed === undefined) {
      return res.status(400).json({ message: 'actual_distance and fuel_consumed are required to complete a trip.' });
    }

    await client.query('BEGIN');
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
    const trip = tripRes.rows[0];
    if (!trip) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Trip not found.' });
    }
    if (trip.status !== 'Dispatched') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Only Dispatched trips can be completed. Current status: ${trip.status}.` });
    }

    await client.query(`UPDATE vehicles SET status = 'Available', odometer = odometer + $2, updated_at = NOW() WHERE id = $1`, [
      trip.vehicle_id,
      actual_distance,
    ]);
    await client.query(`UPDATE drivers SET status = 'Available', updated_at = NOW() WHERE id = $1`, [trip.driver_id]);

    const updated = await client.query(
      `UPDATE trips SET status = 'Completed', actual_distance = $2, fuel_consumed = $3, revenue = COALESCE($4, revenue),
       completed_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, actual_distance, fuel_consumed, revenue]
    );

    // Auto-log fuel consumption for this trip
    if (Number(fuel_consumed) > 0) {
      const estCost = Number(fuel_consumed) * 100; // placeholder rate; adjust via fuel log edit if needed
      await client.query(
        `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date) VALUES ($1,$2,$3,$4,CURRENT_DATE)`,
        [trip.vehicle_id, id, fuel_consumed, estCost]
      );
    }

    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to complete trip.' });
  } finally {
    client.release();
  }
}

// Cancel a Draft or Dispatched trip. Restores vehicle/driver if it was Dispatched.
async function cancelTrip(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');

    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [id]);
    const trip = tripRes.rows[0];
    if (!trip) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Trip not found.' });
    }
    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Cannot cancel a trip with status "${trip.status}".` });
    }

    if (trip.status === 'Dispatched') {
      await client.query(`UPDATE vehicles SET status = 'Available', updated_at = NOW() WHERE id = $1`, [trip.vehicle_id]);
      await client.query(`UPDATE drivers SET status = 'Available', updated_at = NOW() WHERE id = $1`, [trip.driver_id]);
    }

    const updated = await client.query(
      `UPDATE trips SET status = 'Cancelled', cancelled_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel trip.' });
  } finally {
    client.release();
  }
}

module.exports = { listTrips, getTrip, createTrip, dispatchTrip, completeTrip, cancelTrip };
