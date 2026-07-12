const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getFuelLogs, createFuelLog } = require('../controllers/fuelController');

router.use(authenticate);
router.get('/', getFuelLogs);
router.post('/', createFuelLog);

module.exports = router;