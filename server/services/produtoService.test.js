const test = require('node:test');
const assert = require('node:assert/strict');

const { parseSuggestionIds } = require('./produtoService');

test('separa IDs de sugestões mantendo apenas valores preenchidos', () => {
  assert.deepEqual(parseSuggestionIds('a, b,, c '), ['a', 'b', 'c']);
});