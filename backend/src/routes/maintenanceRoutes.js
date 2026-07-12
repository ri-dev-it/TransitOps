const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { listMaintenance, createMaintenance, closeMaintenance } = require('../controllers/maintenanceController');

router.use(authenticate);

router.get('/', listMaintenance);
router.post('/', authorize('fleet_manager', 'admin'), createMaintenance);
router.post('/:id/close', authorize('fleet_manager', 'admin'), closeMaintenance);

module.exports = router;
