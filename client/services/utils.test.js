const test = require('node:test');
const assert = require('node:assert/strict');

const { buildCareGuideMessage, normalizeWhatsappPhone } = require('./utils');

test('normaliza telefones nacionais sem duplicar DDD 55', () => {
  assert.equal(normalizeWhatsappPhone('(55) 99888-7766'), '5555998887766');
  assert.equal(normalizeWhatsappPhone('551199887766'), '551199887766');
  assert.equal(normalizeWhatsappPhone('5511998877665'), '5511998877665');
});

test('guia lista apenas campos botânicos existentes', () => {
  const message = buildCareGuideMessage({ nome: 'Ana' }, [
    { produto: { nome: 'Vaso', rega: null, iluminacao: null, cuidados: null, usos: null } },
    { produto: { nome: 'Orquídea', rega: 'semanal', cuidados: 'evitar sol direto' } }
  ]);

  assert.match(message, /Orquídea/);
  assert.match(message, /Rega:/);
  assert.match(message, /Cuidados:/);
  assert.doesNotMatch(message, /Vaso/);
  assert.doesNotMatch(message, /Luz indireta|1 a 2 vezes/);
});