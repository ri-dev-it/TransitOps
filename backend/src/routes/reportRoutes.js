const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getReports } = require('../controllers/reportController');

router.use(authenticate);
router.get('/', getReports);

module.exports = router;