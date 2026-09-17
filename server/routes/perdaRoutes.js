const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/rbacMiddleware');
const controller = require('../controllers/perdaController');

router.use(authMiddleware, checkRole(['ADMIN', 'GERENTE']));
router.get('/', controller.list);
router.post('/', controller.create);

module.exports = router;
