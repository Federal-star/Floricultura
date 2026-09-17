const router = require('express').Router();
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');

router.use(healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;
