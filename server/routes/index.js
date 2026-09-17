const router = require('express').Router();
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const produtoRoutes = require('./produtoRoutes');
const pedidoRoutes = require('./pedidoRoutes');
const perdaRoutes = require('./perdaRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const usuarioRoutes = require('./usuarioRoutes');

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/produtos', produtoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/perdas', perdaRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
