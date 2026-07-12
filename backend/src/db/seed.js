const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const DEMO_PASSWORD = 'Passw0rd!';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const users = [
      ['Fleet Manager', 'manager@transitops.com', 'fleet_manager'],
      ['Sam Driver', 'driver@transitops.com', 'driver'],
      ['Safety Officer', 'safety@transitops.com', 'safety_officer'],
      ['Finance Analyst', 'finance@transitops.com', 'financial_analyst'],
    ];

    for (const [name, email, role] of users) {
      await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [name, email, hash, role]
      );
    }

    const vehicles = [
      ['VAN-05', 'Tata Ace Van', 'Van', 500, 12000, 850000, 'Available', 'North'],
      ['TRK-11', 'Ashok Leyland Truck', 'Truck', 5000, 45000, 2800000, 'Available', 'South'],
      ['BIKE-02', 'Bajaj Delivery Bike', 'Bike', 30, 8000, 90000, 'Available', 'North'],
    ];
    for (const v of vehicles) {
      await client.query(
        `INSERT INTO vehicles (registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status, region)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (registration_number) DO NOTHING`,
        v
      );
    }

    const drivers = [
      ['Alex Kumar', 'DL-1001', 'LMV', '2027-05-01', '9876500001', 92, 'Available', 'North'],
      ['Priya Singh', 'DL-1002', 'HMV', '2026-12-15', '9876500002', 88, 'Available', 'South'],
    ];
    for (const d of drivers) {
      await client.query(
        `INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status, region)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (license_number) DO NOTHING`,
        d
      );
    }

    await client.query('COMMIT');
    console.log('✅ Seed data inserted.');
    console.log(`   Demo login password for all seeded users: ${DEMO_PASSWORD}`);
    users.forEach(([, email, role]) => console.log(`   ${role.padEnd(18)} -> ${email}`));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
