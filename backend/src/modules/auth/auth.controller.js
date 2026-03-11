const authService = require('./auth.service');
const { registerSchema, loginSchema } = require('./auth.schema');

async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors?.[0]?.message ?? 'Validation error',
        code: 'BAD_REQUEST',
      });
    }
    const result = await authService.register(parsed.data);
    res.status(201).json(result);
  } catch (err) {
    if (err.status === 400 && err.code === 'EMAIL_TAKEN') {
      return res.status(400).json({ message: 'Email already taken', code: err.code });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors?.[0]?.message ?? 'Validation error',
        code: 'BAD_REQUEST',
      });
    }
    const result = await authService.login(parsed.data);
    res.json(result);
  } catch (err) {
    if (err.status === 401) {
      return res.status(401).json({ message: err.message, code: err.code });
    }
    next(err);
  }
}

module.exports = { register, login };
