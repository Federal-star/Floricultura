const prisma = require('../config/prisma');

function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function search(query) {
  const q = normalizeQuery(query);
  if (q.length < 2) return { produtos: [], clientes: [] };

  const [produtos, clientes] = await prisma.$transaction([
    prisma.produto.findMany({
      where: { ativo: true, OR: [{ nome: { contains: q, mode: 'insensitive' } }, { sku: { contains: q, mode: 'insensitive' } }, { descricao: { contains: q, mode: 'insensitive' } }] },
      select: { id: true, nome: true, sku: true, descricao: true },
      orderBy: { nome: 'asc' },
      take: 10
    }),
    prisma.cliente.findMany({
      where: { OR: [{ nome: { contains: q, mode: 'insensitive' } }, { cpfCnpj: { contains: q } }, { telefone: { contains: q } }] },
      select: { id: true, nome: true, cpfCnpj: true, telefone: true },
      orderBy: { nome: 'asc' },
      take: 10
    })
  ]);

  return { produtos, clientes };
}

module.exports = { normalizeQuery, search };