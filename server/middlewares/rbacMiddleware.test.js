const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const authMiddleware = require('./authMiddleware');
const checkRole = require('./rbacMiddleware');

test('VENDEDOR recebe 403 ao acessar uma rota administrativa', () => {
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

  authMiddleware(request, response, () => {
    checkRole(['ADMIN'])(request, response, () => {
      nextCalled = true;
    });
  });

  assert.equal(response.statusCode, 403);
  assert.equal(response.payload.success, false);
  assert.equal(nextCalled, false);
});
