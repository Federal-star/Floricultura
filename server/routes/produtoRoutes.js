const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/rbacMiddleware');
const controller = require('../controllers/produtoController');

router.use(authMiddleware);
router.get('/', controller.list);
router.get('/:id', controller.detail);
router.post('/', checkRole(['ADMIN', 'GERENTE']), controller.create);
router.put('/:id', checkRole(['ADMIN', 'GERENTE']), controller.update);
router.delete('/:id', checkRole(['ADMIN']), controller.remove);

module.exports = router;
