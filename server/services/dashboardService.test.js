const test = require('node:test');
const assert = require('node:assert/strict');

const { classifyStock } = require('./dashboardService');

test('classifica estoque zerado, baixo e normal pelo limite configurado', () => {
  assert.equal(classifyStock(0), 'ZERADO');
  assert.equal(classifyStock(5), 'BAIXO');
  assert.equal(classifyStock(6), 'NORMAL');
});