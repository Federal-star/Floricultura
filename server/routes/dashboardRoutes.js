const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/rbacMiddleware');
const controller = require('../controllers/dashboardController');

router.use(authMiddleware, checkRole(['ADMIN', 'GERENTE']));
router.get('/kpis', controller.kpis);
router.get('/vendas-por-pagamento', controller.salesByPayment);

module.exports = router;
