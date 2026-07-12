const pool = require('../config/db');

// Get all trips with joined vehicle and driver data
async function getAllTrips(req, res) {
  try {
    const result = await pool.query(`
      SELECT t.*, v.registration_number as vehicle_reg, d.name as driver_name 
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN drivers d ON t.driver_id = d.id
      ORDER BY t.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trips.' });
  }
}

// Create a new trip (Starts in 'Draft' status)
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
    console.error(err);
    res.status(500).json({ message: 'Failed to create trip.' });
  }
}

// Dispatch a trip and enforce mandatory business rules
async function dispatchTrip(req, res) {
  const { id } = req.params;
  const client = await pool.connect(); // Start a managed transaction
  
  try {
    await client.query('BEGIN');
    
    // 1. Fetch Trip details
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1', [id]);
    const trip = tripRes.rows[0];
    
    if (!trip || trip.status !== 'Draft') {
      throw new Error('Only Draft trips can be dispatched.');
    }

    // 2. Fetch Vehicle & Driver
    const vehicleRes = await client.query('SELECT status, max_load_capacity FROM vehicles WHERE id = $1', [trip.vehicle_id]);
    const driverRes = await client.query('SELECT status, license_expiry_date FROM drivers WHERE id = $1', [trip.driver_id]);
    
    const vehicle = vehicleRes.rows[0];
    const driver = driverRes.rows[0];

    // 3. Enforce Mandatory Validations
    if (!vehicle || vehicle.status === 'Retired' || vehicle.status === 'In Shop' || vehicle.status === 'On Trip') {
      throw new Error('Vehicle is not available for dispatch.');
    }
    if (!driver || driver.status === 'Suspended' || driver.status === 'On Trip' || new Date(driver.license_expiry_date) < new Date()) {
      throw new Error('Driver is unavailable or has an expired license.');
    }
    if (Number(trip.cargo_weight) > Number(vehicle.max_load_capacity)) {
      throw new Error('Cargo weight exceeds the maximum vehicle capacity.');
    }

    // 4. Update statuses automatically
    await client.query(`UPDATE trips SET status = 'Dispatched' WHERE id = $1`, [id]);
    await client.query(`UPDATE vehicles SET status = 'On Trip' WHERE id = $1`, [trip.vehicle_id]);
    await client.query(`UPDATE drivers SET status = 'On Trip' WHERE id = $1`, [trip.driver_id]);

    await client.query('COMMIT');
    res.json({ message: 'Trip dispatched successfully!' });
  } catch (err) {
    await client.query('ROLLBACK'); // Revert changes if any rule fails
    console.error(err);
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
}

// Complete a trip and free up assets
async function completeTrip(req, res) {
  const { id } = req.params;
  const { final_odometer } = req.body; 
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1', [id]);
    const trip = tripRes.rows[0];
    
    if (!trip || trip.status !== 'Dispatched') {
      throw new Error('Only active Dispatched trips can be completed.');
    }

    // Update statuses back to available
    await client.query(`UPDATE trips SET status = 'Completed' WHERE id = $1`, [id]);
    await client.query(`UPDATE vehicles SET status = 'Available', odometer = $1 WHERE id = $2`, [final_odometer, trip.vehicle_id]);
    await client.query(`UPDATE drivers SET status = 'Available' WHERE id = $1`, [trip.driver_id]);

    await client.query('COMMIT');
    res.json({ message: 'Trip completed successfully!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
}

// Exact export names required by the routes
module.exports = { getAllTrips, createTrip, dispatchTrip, completeTrip };