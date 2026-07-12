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
// Add this to vehicleRoutes.js
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM vehicles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});
module.exports = router;
