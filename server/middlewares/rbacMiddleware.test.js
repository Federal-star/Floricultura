const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const prisma = require('../config/prisma');
const authMiddleware = require('./authMiddleware');
const checkRole = require('./rbacMiddleware');

test('VENDEDOR recebe 403 ao acessar uma rota administrativa', async () => {
  const originalFindUnique = prisma.usuario.findUnique;
  prisma.usuario.findUnique = async () => ({ id: 'vendedor-1', nome: 'Vendedor', email: 'vendedor@floricultura.com', role: 'VENDEDOR', ativo: true });
  const token = jwt.sign(
    { id: 'vendedor-1', nome: 'Vendedor', email: 'vendedor@floricultura.com', role: 'VENDEDOR' },
    env.jwtSecret,
    { expiresIn: '8h' }
  );
  const request = { headers: { authorization: `Bearer ${token}` } };
  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
  let nextCalled = false;

  await authMiddleware(request, response, () => {
    checkRole(['ADMIN'])(request, response, () => {
      nextCalled = true;
    });
  });

  prisma.usuario.findUnique = originalFindUnique;

  assert.equal(response.statusCode, 403);
  assert.equal(response.payload.success, false);
  assert.equal(nextCalled, false);
});

test('usuário desativado recebe 401 mesmo com token válido', async () => {
  const originalFindUnique = prisma.usuario.findUnique;
  prisma.usuario.findUnique = async () => ({ id: 'vendedor-1', nome: 'Vendedor', email: 'vendedor@floricultura.com', role: 'VENDEDOR', ativo: false });
  const token = jwt.sign({ id: 'vendedor-1' }, env.jwtSecret, { expiresIn: '8h' });
  const request = { headers: { authorization: `Bearer ${token}` } };
  const response = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };

  await authMiddleware(request, response, () => {});
  prisma.usuario.findUnique = originalFindUnique;

  assert.equal(response.statusCode, 401);
  assert.equal(response.payload.success, false);
});

test('VENDEDOR pode acessar uma rota que permite registro de perdas', () => {
  const request = { user: { role: 'VENDEDOR' } };
  let nextCalled = false;
  checkRole(['ADMIN', 'GERENTE', 'VENDEDOR'])(request, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
