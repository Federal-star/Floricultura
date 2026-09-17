const { Prisma } = require('@prisma/client');

const prisma = require('../config/prisma');

const FORMAS_PAGAMENTO = ['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO'];

class PedidoValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function normalizeItems(items) {
  const quantities = new Map();

  for (const item of items) {
    if (!item || typeof item.produtoId !== 'string' || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new PedidoValidationError('Cada item deve informar produtoId e uma quantidade inteira positiva');
    }
    quantities.set(item.produtoId, (quantities.get(item.produtoId) || 0) + item.quantidade);
  }

  return [...quantities.entries()]
    .map(([produtoId, quantidade]) => ({ produtoId, quantidade }))
    .sort((left, right) => left.produtoId.localeCompare(right.produtoId));
}

function serializePedido(pedido) {
  return {
    ...pedido,
    valorTotal: pedido.valorTotal.toString(),
    desconto: pedido.desconto.toString(),
    itens: pedido.itens.map((item) => ({
      ...item,
      precoUnitario: item.precoUnitario.toString(),
      subtotal: item.subtotal.toString()
    }))
  };
}

async function create({ usuarioId, items, desconto = 0, formaPagamento }) {
  if (!Array.isArray(items) || items.length === 0) throw new PedidoValidationError('O pedido deve conter ao menos um item');
  if (!FORMAS_PAGAMENTO.includes(formaPagamento)) throw new PedidoValidationError('Forma de pagamento inválida');

  const descontoDecimal = new Prisma.Decimal(desconto);
  if (descontoDecimal.isNegative()) throw new PedidoValidationError('O desconto não pode ser negativo');

  const normalizedItems = normalizeItems(items);

  const pedido = await prisma.$transaction(async (tx) => {
    const productIds = normalizedItems.map((item) => item.produtoId);
    const lockedProducts = await tx.$queryRaw`
      SELECT "id", "nome", "precoVenda", "quantidadeEstoque", "ativo"
      FROM "Produto"
      WHERE "id" IN (${Prisma.join(productIds)})
      ORDER BY "id" ASC
      FOR UPDATE
    `;
    const productsById = new Map(lockedProducts.map((product) => [product.id, product]));
    const itemRows = [];
    let total = new Prisma.Decimal(0);

    for (const item of normalizedItems) {
      const product = productsById.get(item.produtoId);
      if (!product || !product.ativo) throw new PedidoValidationError('Um dos produtos selecionados não está disponível');
      if (product.quantidadeEstoque < item.quantidade) {
        throw new PedidoValidationError(`Estoque insuficiente para ${product.nome}. Disponível: ${product.quantidadeEstoque}`);
      }

      const precoUnitario = new Prisma.Decimal(product.precoVenda);
      const subtotal = precoUnitario.mul(item.quantidade);
      total = total.add(subtotal);
      itemRows.push({ produtoId: item.produtoId, quantidade: item.quantidade, precoUnitario, subtotal });
    }

    if (descontoDecimal.greaterThan(total)) throw new PedidoValidationError('O desconto não pode ser maior que o subtotal');
    const valorTotal = total.sub(descontoDecimal);

    for (const item of normalizedItems) {
      await tx.produto.update({ where: { id: item.produtoId }, data: { quantidadeEstoque: { decrement: item.quantidade } } });
    }

    return tx.pedido.create({
      data: {
        usuarioId,
        valorTotal,
        desconto: descontoDecimal,
        formaPagamento,
        status: 'CONCLUIDO',
        itens: { create: itemRows }
      },
      include: { itens: true }
    });
  });

  return serializePedido(pedido);
}

module.exports = { FORMAS_PAGAMENTO, PedidoValidationError, create };
