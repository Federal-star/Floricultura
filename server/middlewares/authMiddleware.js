const jwt = require('jsonwebtoken');

const env = require('../config/env');

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação não informado'
    });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação inválido ou expirado'
    });
  }
}

module.exports = authMiddleware;
