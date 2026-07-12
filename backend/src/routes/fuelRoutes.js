const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { listFuelLogs, createFuelLog } = require('../controllers/fuelController');

router.use(authenticate);
router.get('/', listFuelLogs);
router.post('/', createFuelLog);

module.exports = router;
