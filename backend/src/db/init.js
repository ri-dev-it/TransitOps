const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('✅ Database schema created successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize schema:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

init();
