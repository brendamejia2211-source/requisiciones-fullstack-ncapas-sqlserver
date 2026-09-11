const router = require('express').Router();
const controller = require('../controllers/requisitionController');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, controller.list);
router.post('/', auth, role('empleado'), controller.create);
router.patch('/:id/approve', auth, role('administrador'), controller.approve);
router.patch('/:id/reject', auth, role('administrador'), controller.reject);

module.exports = router;
