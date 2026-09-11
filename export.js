const router = require('express').Router();
const controller = require('../controllers/exportController');
const { auth, role } = require('../middleware/auth');
router.get('/metrics.csv', auth, role('administrador'), controller.metricsCsv);
module.exports = router;
