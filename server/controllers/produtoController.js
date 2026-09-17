const produtoService = require('../services/produtoService');

function isValidNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isValidStock(value) {
  return Number.isInteger(value) && value >= 0;
}

function sendKnownError(res, error) {
  if (error.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Este SKU já está cadastrado' });
  }
  if (error.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Produto não encontrado' });
  }
  return null;
}

function normalizePayload(body, partial = false) {
  const data = {};
  const fields = ['nome', 'sku', 'categoria', 'descricao', 'imagemUrl', 'rega', 'iluminacao', 'cuidados'];

  for (const field of fields) {
    if (!partial || body[field] !== undefined) data[field] = body[field] === '' ? null : body[field];
  }
  if (!partial || body.precoVenda !== undefined) data.precoVenda = Number(body.precoVenda);
  if (!partial || body.quantidadeEstoque !== undefined) data.quantidadeEstoque = Number(body.quantidadeEstoque);

  return data;
}

function validate(data, partial = false) {
  if ((!partial && !data.nome) || (!partial && !data.sku) || (!partial && !data.categoria)) return 'Nome, SKU e categoria são obrigatórios';
  if (data.categoria !== undefined && !produtoService.isValidCategory(data.categoria)) return 'Categoria de produto inválida';
  if (data.precoVenda !== undefined && !isValidNonNegativeNumber(data.precoVenda)) return 'O preço de venda deve ser um número não negativo';
  if (data.quantidadeEstoque !== undefined && !isValidStock(data.quantidadeEstoque)) return 'O estoque deve ser um número inteiro não negativo';
  return null;
}

async function list(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(Number.parseInt(req.query.pageSize, 10) || 10, 1), 100);
    const { categoria } = req.query;
    if (categoria && !produtoService.isValidCategory(categoria)) return res.status(400).json({ success: false, error: 'Categoria de produto inválida' });
    return res.status(200).json({ success: true, data: await produtoService.list({ page, pageSize, categoria }) });
  } catch (error) { return next(error); }
}

async function detail(req, res, next) {
  try {
    const produto = await produtoService.findById(req.params.id);
    if (!produto) return res.status(404).json({ success: false, error: 'Produto não encontrado' });
    return res.status(200).json({ success: true, data: produto });
  } catch (error) { return next(error); }
}

async function create(req, res, next) {
  try {
    const data = normalizePayload(req.body);
    const validationError = validate(data);
    if (validationError) return res.status(400).json({ success: false, error: validationError });
    return res.status(201).json({ success: true, data: await produtoService.create(data) });
  } catch (error) { return sendKnownError(res, error) || next(error); }
}

async function update(req, res, next) {
  try {
    const data = normalizePayload(req.body, true);
    const validationError = validate(data, true);
    if (validationError) return res.status(400).json({ success: false, error: validationError });
    return res.status(200).json({ success: true, data: await produtoService.update(req.params.id, data) });
  } catch (error) { return sendKnownError(res, error) || next(error); }
}

async function remove(req, res, next) {
  try {
    return res.status(200).json({ success: true, data: await produtoService.deactivate(req.params.id) });
  } catch (error) { return sendKnownError(res, error) || next(error); }
}

module.exports = { list, detail, create, update, remove };
