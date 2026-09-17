const perdaService = require('../services/perdaService');

async function create(req, res, next) {
  try {
    const { produtoId, quantidade, motivo, observacao } = req.body;
    const data = await perdaService.create({ produtoId, usuarioId: req.user.id, quantidade, motivo, observacao });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof perdaService.PerdaValidationError) return res.status(400).json({ success: false, error: error.message });
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(Number.parseInt(req.query.pageSize, 10) || 10, 1), 100);
    const { motivo, produtoId } = req.query;
    if (motivo && !perdaService.MOTIVOS.includes(motivo)) return res.status(400).json({ success: false, error: 'Motivo de perda inválido' });
    return res.status(200).json({ success: true, data: await perdaService.list({ page, pageSize, motivo, produtoId }) });
  } catch (error) { return next(error); }
}

module.exports = { create, list };
