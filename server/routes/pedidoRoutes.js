const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/pedidoController');

router.use(authMiddleware);
router.post('/', controller.create);

module.exports = router;
