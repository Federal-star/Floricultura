const jwt = require('jsonwebtoken');

const env = require('../config/env');
const prisma = require('../config/prisma');

async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação não informado'
    });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.id },
      select: { id: true, nome: true, email: true, role: true, ativo: true }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado ou inativo'
      });
    }

    req.user = usuario;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação inválido ou expirado'
    });
  }
}

module.exports = authMiddleware;
