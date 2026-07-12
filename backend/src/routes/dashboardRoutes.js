const express = require('express');
const router = express.Router();

// 1. Import the middleware
const { authenticate } = require('../middleware/auth');

// 2. Import the controller (This exact name { getKpis } prevents the Undefined error)
const { getKpis } = require('../controllers/dashboardController');

// 3. Apply middleware and routes
router.use(authenticate);
router.get('/kpis', getKpis);

module.exports = router;