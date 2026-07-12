const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Clearing existing data...');
    await pool.query(`
      TRUNCATE TABLE
        expenses,
        fuel_logs,
        maintenance_logs,
        trips,
        vehicles,
        drivers,
        users
      RESTART IDENTITY CASCADE
    `);

    console.log('Inserting demo users...');
    const passwordHash = await bcrypt.hash('Passw0rd!', 10);
    await pool.query(`
      INSERT INTO users (name, email, password_hash, role, region) VALUES
      ('Fleet Manager', 'manager@transitops.com', $1, 'fleet_manager', 'North'),
      ('Demo Driver', 'driver@transitops.com', $1, 'driver', 'North'),
      ('Safety Officer', 'safety@transitops.com', $1, 'safety_officer', 'North'),
      ('Financial Analyst', 'finance@transitops.com', $1, 'financial_analyst', 'North'),
      ('Admin User', 'admin@transitops.com', $1, 'admin', 'North')
    `, [passwordHash]);

    console.log('Inserting dummy vehicles...');
    await pool.query(`
      INSERT INTO vehicles (registration_number, name, type, max_load_capacity, acquisition_cost, status, odometer) VALUES
      ('TR-204', 'Volvo FH16', 'Truck', 20000, 150000, 'Available', 45000),
      ('TR-221', 'Scania R500', 'Truck', 18000, 140000, 'Available', 32000),
      ('VN-001', 'Ford Transit', 'Van', 2500, 45000, 'Available', 12000),
      ('TR-407', 'MAN TGX', 'Truck', 22000, 160000, 'In Shop', 85000)
    `);

    console.log('Inserting dummy drivers...');
    await pool.query(`
      INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) VALUES
      ('Alex Johnson', 'LIC-9091', 'Heavy', '2028-05-15', '+1234567890', 98, 'Available'),
      ('Maria Garcia', 'LIC-8822', 'Heavy', '2027-11-20', '+1987654321', 100, 'Available'),
      ('James Smith', 'LIC-7733', 'Light', '2029-01-10', '+1122334455', 95, 'Available'),
      ('David Miller', 'LIC-4455', 'Heavy', '2023-02-01', '+1555666777', 60, 'Suspended')
    `);

    console.log('✅ Database seeded successfully with dummy data!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    pool.end(); 
  }
}

seedDatabase();
