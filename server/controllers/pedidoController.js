const pedidoService = require('../services/pedidoService');

async function create(req, res, next) {
  try {
    const { clienteId, items, desconto, troco, formaPagamento } = req.body;
    const data = await pedidoService.create({
      usuarioId: req.user.id,
      clienteId,
      items,
      desconto,
      troco,
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

async function cancel(req, res, next) {
  try {
    return res.status(200).json({ success: true, data: await pedidoService.cancel(req.params.id) });
  } catch (error) {
    if (error instanceof pedidoService.PedidoValidationError || error instanceof pedidoService.PedidoNotFoundError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    return next(error);
  }
}

module.exports = { create, cancel };
