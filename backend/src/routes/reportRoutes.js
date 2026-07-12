const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getVehicleReports, exportVehicleReportsCsv } = require('../controllers/reportController');

router.use(authenticate);
router.get('/', getVehicleReports);
router.get('/export/csv', exportVehicleReportsCsv);

module.exports = router;
