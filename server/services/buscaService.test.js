const test = require('node:test');
const assert = require('node:assert/strict');

const buscaService = require('./buscaService');

test('normaliza busca e rejeita termos curtos', async () => {
  assert.equal(buscaService.normalizeQuery('  rosa  '), 'rosa');
  assert.deepEqual(await buscaService.search('a'), { produtos: [], clientes: [] });
});