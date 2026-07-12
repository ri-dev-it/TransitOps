const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
// 1. Ensure 'cancelTrip' is inside these curly braces
const { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } = require('../controllers/tripController');

router.use(authenticate);

router.get('/', getTrips);
router.post('/', createTrip);
router.patch('/:id/dispatch', dispatchTrip);
router.patch('/:id/complete', completeTrip);
// 2. Now this line will work because cancelTrip is defined
router.patch('/:id/cancel', cancelTrip);

module.exports = router;