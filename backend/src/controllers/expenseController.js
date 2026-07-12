const pool = require('../config/db');

async function listExpenses(req, res) {
  try {
    const { vehicle_id, category } = req.query;
    const clauses = [];
    const values = [];
    if (vehicle_id) {
      values.push(vehicle_id);
      clauses.push(`vehicle_id = $${values.length}`);
    }
    if (category) {
      values.push(category);
      clauses.push(`category = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(`SELECT * FROM expenses ${where} ORDER BY expense_date DESC`, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch expenses.' });
  }
}

async function createExpense(req, res) {
  try {
    const { vehicle_id, category, description, amount, expense_date } = req.body;
    if (!vehicle_id || !category || amount === undefined) {
      return res.status(400).json({ message: 'vehicle_id, category and amount are required.' });
    }
    if (Number(amount) < 0) {
      return res.status(400).json({ message: 'amount must be >= 0.' });
    }

    const vehicleCheck = await pool.query('SELECT id FROM vehicles WHERE id = $1', [vehicle_id]);
    if (!vehicleCheck.rows[0]) return res.status(404).json({ message: 'Vehicle not found.' });

    const result = await pool.query(
      `INSERT INTO expenses (vehicle_id, category, description, amount, expense_date)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE)) RETURNING *`,
      [vehicle_id, category, description || null, amount, expense_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create expense.' });
  }
}

module.exports = { listExpenses, createExpense };
