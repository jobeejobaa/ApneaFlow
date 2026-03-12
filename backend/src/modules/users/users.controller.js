const usersService = require('./users.service');
const { updateMeSchema } = require('./users.schema');

/**
 * GET /api/users/me
 * Authentifié (tous rôles) — retourne le profil complet de l'utilisateur connecté.
 */
async function getMe(req, res, next) {
  try {
    const user = await usersService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

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

module.exports = { getMe, updateMe };
