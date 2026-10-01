const buscaService = require('../services/buscaService');

async function search(req, res, next) {
  try {
    const query = buscaService.normalizeQuery(req.query.q);
    if (query.length < 2) return res.status(400).json({ success: false, error: 'Informe ao menos 2 caracteres para buscar.' });
    return res.status(200).json({ success: true, data: await buscaService.search(query) });
  } catch (error) { return next(error); }
}

module.exports = { search };