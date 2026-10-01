const test = require('node:test');
const assert = require('node:assert/strict');

const prisma = require('../config/prisma');
const pedidoService = require('./pedidoService');

test('cancelar pedido devolve estoque e cancela entrega; segunda tentativa falha', async () => {
  const originalTransaction = prisma.$transaction;
  const state = { status: 'CONCLUIDO', estoque: 2, entrega: 'PENDENTE' };
  const fakeTx = {
    async $queryRaw() { return [{ id: 'pedido-1', status: state.status }]; },
    pedido: {
      async findUnique() { return { itens: [{ produtoId: 'produto-1', quantidade: 3 }], entrega: { id: 'entrega-1' } }; },
      async update() { state.status = 'CANCELADO'; return { id: 'pedido-1', status: state.status, valorTotal: '10.00', desconto: '0.00', troco: '0.00', itens: [], cliente: null, usuario: { id: 'u1', nome: 'Admin' }, entrega: null }; }
    },
    produto: { async update({ data }) { state.estoque += data.quantidadeEstoque.increment; } },
    entrega: { async update({ data }) { state.entrega = data.status; } }
  };
  prisma.$transaction = async (callback) => callback(fakeTx);

  const result = await pedidoService.cancel('pedido-1');
  assert.equal(result.status, 'CANCELADO');
  assert.equal(state.estoque, 5);
  assert.equal(state.entrega, 'CANCELADO');
  await assert.rejects(() => pedidoService.cancel('pedido-1'), pedidoService.PedidoValidationError);

  prisma.$transaction = originalTransaction;
});