const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../config/prisma');
const env = require('../config/env');

const INVALID_CREDENTIALS = 'E-mail ou senha inválidos';

async function login(email, senha) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!usuario || !usuario.ativo) {
    throw new Error(INVALID_CREDENTIALS);
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error(INVALID_CREDENTIALS);
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      role: usuario.role
    }
  };
}

module.exports = {
  login,
  INVALID_CREDENTIALS
};
