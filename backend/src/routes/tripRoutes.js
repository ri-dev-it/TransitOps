const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getAllTrips, createTrip, dispatchTrip, completeTrip } = require('../controllers/tripController');

// Apply auth middleware to all trip endpoints
router.use(authenticate);

// Standard CRUD
router.get('/', getAllTrips);
router.post('/', createTrip);

// Lifecycle endpoints
router.post('/:id/dispatch', dispatchTrip);
router.post('/:id/complete', completeTrip);

module.exports = router;