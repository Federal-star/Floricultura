const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const clienteController = require('../controllers/clienteController');

router.use(authMiddleware);
router.get('/', clienteController.listarClientes);
router.post('/', clienteController.criarCliente);

module.exports = router;