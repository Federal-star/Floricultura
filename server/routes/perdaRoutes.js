const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/rbacMiddleware');
const controller = require('../controllers/perdaController');

router.use(authMiddleware);
router.get('/', checkRole(['ADMIN', 'GERENTE']), controller.list);
router.post('/', checkRole(['ADMIN', 'GERENTE', 'VENDEDOR']), controller.create);

module.exports = router;
