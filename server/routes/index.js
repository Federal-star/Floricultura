const router = require('express').Router();
const healthRoutes = require('./healthRoutes');

router.use(healthRoutes);

module.exports = router;
