const prisma = require('../config/prisma');

const CATEGORIAS = ['PLANTA', 'VASO', 'INSUMO', 'ARRANJO', 'OUTROS'];
const publicFields = {
  id: true,
  nome: true,
  sku: true,
  categoria: true,
  precoVenda: true,
  quantidadeEstoque: true,
  descricao: true,
  imagemUrl: true,
  rega: true,
  iluminacao: true,
  cuidados: true,
  ativo: true,
  createdAt: true,
  updatedAt: true
};

function isValidCategory(categoria) {
  return CATEGORIAS.includes(categoria);
}

function serializeProduto(produto) {
  return {
    ...produto,
    precoVenda: produto.precoVenda.toString()
  };
}

async function list({ page, pageSize, categoria }) {
  const where = { ativo: true };
  if (categoria) where.categoria = categoria;

  const [items, total] = await prisma.$transaction([
    prisma.produto.findMany({
      where,
      select: publicFields,
      orderBy: { nome: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.produto.count({ where })
  ]);

  return {
    items: items.map(serializeProduto),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

async function findById(id) {
  const produto = await prisma.produto.findUnique({ where: { id }, select: publicFields });
  return produto ? serializeProduto(produto) : null;
}

async function create(data) {
  return serializeProduto(await prisma.produto.create({ data, select: publicFields }));
}

async function update(id, data) {
  return serializeProduto(await prisma.produto.update({ where: { id }, data, select: publicFields }));
}

async function deactivate(id) {
  return update(id, { ativo: false });
}

module.exports = { CATEGORIAS, isValidCategory, list, findById, create, update, deactivate };
