const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

/**
 * Authenticate JWT from Authorization: Bearer <token>.
 * Injects req.user = { id, role }.
 * 401 if missing or invalid token.
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
  }
}

module.exports = { authenticateJWT };
