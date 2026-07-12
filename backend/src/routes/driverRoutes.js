const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  listDrivers, getDriver, createDriver, updateDriver, deleteDriver,
} = require('../controllers/driverController');

router.use(authenticate);

router.get('/', listDrivers);
router.get('/:id', getDriver);
router.post('/', authorize('fleet_manager', 'safety_officer', 'admin'), createDriver);
router.put('/:id', authorize('fleet_manager', 'safety_officer', 'admin'), updateDriver);
router.delete('/:id', authorize('fleet_manager', 'admin'), deleteDriver);

module.exports = router;
