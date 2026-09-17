const { getHealthStatus } = require('../services/healthService');

function healthCheck(req, res) {
  const payload = getHealthStatus();

  res.status(200).json(payload);
}

module.exports = {
  healthCheck
};
