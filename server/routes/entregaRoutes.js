const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const entregaController = require('../controllers/entregaController');

router.use(authMiddleware);
router.get('/', entregaController.listarEntregas);
router.post('/', entregaController.agendarEntrega);
router.patch('/:id/status', entregaController.atualizarStatus);

module.exports = router;