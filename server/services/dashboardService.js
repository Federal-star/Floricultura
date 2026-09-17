const prisma = require('../config/prisma');

const PAYMENT_METHODS = ['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO'];

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth() {
  const date = startOfToday();
  date.setDate(1);
  return date;
}

function serializeMoney(value) {
  return value ? value.toString() : '0.00';
}

async function getKpis() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const today = startOfToday();
  const month = startOfMonth();

  const [billing, salesToday, lossesThisMonth, criticalCount, criticalProducts] = await prisma.$transaction([
    prisma.pedido.aggregate({
      where: { status: 'CONCLUIDO', createdAt: { gte: last24Hours } },
      _sum: { valorTotal: true }
    }),
    prisma.pedido.count({ where: { status: 'CONCLUIDO', createdAt: { gte: today } } }),
    prisma.perda.aggregate({ where: { createdAt: { gte: month } }, _sum: { quantidade: true } }),
    prisma.produto.count({ where: { ativo: true, quantidadeEstoque: { lte: 5 } } }),
    prisma.produto.findMany({
      where: { ativo: true, quantidadeEstoque: { lte: 5 } },
      select: { id: true, nome: true, sku: true, categoria: true, quantidadeEstoque: true },
      orderBy: { quantidadeEstoque: 'asc' },
      take: 10
    })
  ]);

  return {
    faturamentoDia: serializeMoney(billing._sum.valorTotal),
    vendasHoje: salesToday,
    perdasNoMes: { quantidade: lossesThisMonth._sum.quantidade || 0 },
    produtosEmAlerta: criticalCount,
    produtosCriticos: criticalProducts
  };
}

async function getSalesByPayment() {
  const today = startOfToday();
  const grouped = await prisma.pedido.groupBy({
    by: ['formaPagamento'],
    where: { status: 'CONCLUIDO', createdAt: { gte: today } },
    _sum: { valorTotal: true },
    _count: { _all: true }
  });
  const groupedByMethod = new Map(grouped.map((item) => [item.formaPagamento, item]));

  return PAYMENT_METHODS.map((formaPagamento) => {
    const item = groupedByMethod.get(formaPagamento);
    return {
      formaPagamento,
      faturamento: serializeMoney(item && item._sum.valorTotal),
      quantidadeVendas: item ? item._count._all : 0
    };
  });
}

module.exports = { getKpis, getSalesByPayment };
