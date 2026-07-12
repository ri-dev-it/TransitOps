const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  listVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle,
} = require('../controllers/vehicleController');

router.use(authenticate);

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', authorize('fleet_manager', 'admin'), createVehicle);
router.put('/:id', authorize('fleet_manager', 'admin'), updateVehicle);
router.delete('/:id', authorize('fleet_manager', 'admin'), deleteVehicle);

module.exports = router;
