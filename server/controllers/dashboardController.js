const dashboardService = require('../services/dashboardService');

async function kpis(req, res, next) {
  try {
    return res.status(200).json({ success: true, data: await dashboardService.getKpis() });
  } catch (error) { return next(error); }
}

async function salesByPayment(req, res, next) {
  try {
    return res.status(200).json({ success: true, data: await dashboardService.getSalesByPayment() });
  } catch (error) { return next(error); }
}

module.exports = { kpis, salesByPayment };
