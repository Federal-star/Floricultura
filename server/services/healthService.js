function getHealthStatus() {
  return {
    success: true,
    status: 'online',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  getHealthStatus
};
