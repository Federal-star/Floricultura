const router = require('express').Router();
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const usuarioRoutes = require('./usuarioRoutes');

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;
