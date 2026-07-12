const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  listTrips, getTrip, createTrip, dispatchTrip, completeTrip, cancelTrip,
} = require('../controllers/tripController');

router.use(authenticate);

router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/', createTrip);
router.post('/:id/dispatch', dispatchTrip);
router.post('/:id/complete', completeTrip);
router.post('/:id/cancel', cancelTrip);

module.exports = router;
