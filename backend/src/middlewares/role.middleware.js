/**
 * Require req.user.role to be one of the allowed roles.
 * Must be used after authenticateJWT.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden', code: 'FORBIDDEN' });
    }
    next();
  };
}

module.exports = { requireRole };
