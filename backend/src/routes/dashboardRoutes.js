const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getKpis } = require('../controllers/dashboardController');

router.use(authenticate);
router.get('/kpis', getKpis);

module.exports = router;
