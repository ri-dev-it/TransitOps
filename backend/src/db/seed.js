const pool = require('../config/db');

async function seedDatabase() {
  try {
    console.log('Clearing existing data...');
    // We must delete trips first because they rely on vehicles and drivers
    await pool.query('DELETE FROM trips');
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM drivers');

    console.log('Inserting dummy vehicles...');
    await pool.query(`
      INSERT INTO vehicles (registration_number, model, type, max_load_capacity, acquisition_cost, status, odometer) VALUES
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