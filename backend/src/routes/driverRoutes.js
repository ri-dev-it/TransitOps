const express = require('express');
const router = express.Router();

// 1. Import the middleware
const { authenticate } = require('../middleware/auth');

// 2. Import the controller functions (Exact match to exports to prevent errors)
const { getAllDrivers, createDriver, updateDriverStatus } = require('../controllers/driverController');

// 3. Apply authentication middleware to all routes below
router.use(authenticate);

// 4. Define driver routes
router.get('/', getAllDrivers);
router.post('/', createDriver);
router.patch('/:id/status', updateDriverStatus);

module.exports = router;