const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const controller = require('../controllers/buscaController');

router.get('/', authMiddleware, controller.search);

module.exports = router;