const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/rbacMiddleware');
const controller = require('../controllers/usuarioController');

router.use(authMiddleware);
router.get('/', checkRole(['ADMIN', 'GERENTE']), controller.list);
router.post('/', checkRole(['ADMIN']), controller.create);
router.put('/:id', checkRole(['ADMIN']), controller.update);
router.delete('/:id', checkRole(['ADMIN']), controller.remove);

module.exports = router;
