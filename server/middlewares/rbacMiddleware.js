function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para realizar esta ação'
      });
    }

    return next();
  };
}

module.exports = checkRole;
