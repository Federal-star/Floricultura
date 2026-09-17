const prisma = require('../config/prisma');

const MOTIVOS = ['DETERIORACAO', 'AVARIA', 'PRAGA', 'VALIDADE', 'OUTROS'];

class PerdaValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

async function create({ produtoId, usuarioId, quantidade, motivo, observacao }) {
  if (!produtoId || !Number.isInteger(quantidade) || quantidade <= 0) {
    throw new PerdaValidationError('Produto e uma quantidade inteira positiva são obrigatórios');
  }
  if (!MOTIVOS.includes(motivo)) throw new PerdaValidationError('Motivo de perda inválido');

  return prisma.$transaction(async (tx) => {
    const products = await tx.$queryRaw`
      SELECT "id", "nome", "quantidadeEstoque", "ativo"
      FROM "Produto"
      WHERE "id" = ${produtoId}
      FOR UPDATE
    `;
    const produto = products[0];

    if (!produto || !produto.ativo) throw new PerdaValidationError('Produto não encontrado ou inativo');
    if (produto.quantidadeEstoque < quantidade) {
      throw new PerdaValidationError(`Saldo insuficiente para ${produto.nome}. Disponível: ${produto.quantidadeEstoque}`);
    }

    await tx.produto.update({ where: { id: produtoId }, data: { quantidadeEstoque: { decrement: quantidade } } });
    return tx.perda.create({
      data: { produtoId, usuarioId, quantidade, motivo, observacao: observacao || null },
      include: { produto: { select: { nome: true, sku: true } }, usuario: { select: { nome: true } } }
    });
  });
}

async function list({ page, pageSize, motivo, produtoId }) {
  const where = {};
  if (motivo) where.motivo = motivo;
  if (produtoId) where.produtoId = produtoId;

  const [items, total] = await prisma.$transaction([
    prisma.perda.findMany({
      where,
      include: { produto: { select: { nome: true, sku: true } }, usuario: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.perda.count({ where })
  ]);

  return {
    items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
  };
}

module.exports = { MOTIVOS, PerdaValidationError, create, list };
