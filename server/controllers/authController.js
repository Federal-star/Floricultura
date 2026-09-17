const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (typeof email !== 'string' || !email.trim() || typeof senha !== 'string' || !senha) {
      return res.status(400).json({
        success: false,
        error: 'E-mail e senha são obrigatórios'
      });
    }

    const data = await authService.login(email.trim(), senha);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    if (error.message === authService.INVALID_CREDENTIALS) {
      return res.status(401).json({
        success: false,
        error: authService.INVALID_CREDENTIALS
      });
    }

    return next(error);
  }
}

module.exports = {
  login
};
