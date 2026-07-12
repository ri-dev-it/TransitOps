const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { listExpenses, createExpense } = require('../controllers/expenseController');

router.use(authenticate);
router.get('/', listExpenses);
router.post('/', createExpense);

module.exports = router;
