const pedidoService = require('../services/pedidoService');

async function create(req, res, next) {
  try {
    const { items, desconto, formaPagamento } = req.body;
    const data = await pedidoService.create({
      usuarioId: req.user.id,
      items,
      desconto,
      formaPagamento
    });

    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof pedidoService.PedidoValidationError) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return next(error);
  }
}

module.exports = { create };
