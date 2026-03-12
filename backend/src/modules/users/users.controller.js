const usersService = require('./users.service');
const { updateMeSchema } = require('./users.schema');

/**
 * PATCH /api/users/me
 * Authentifié (tous rôles) — met à jour nom, email et/ou mot de passe.
 */
async function updateMe(req, res, next) {
  try {
    const parsed = updateMeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors?.[0]?.message ?? 'Validation error',
        code: 'BAD_REQUEST',
      });
    }

    const updated = await usersService.updateMe(req.user.id, parsed.data);
    res.json(updated);
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ message: err.message, code: err.code });
    }
    next(err);
  }
}

module.exports = { updateMe };
