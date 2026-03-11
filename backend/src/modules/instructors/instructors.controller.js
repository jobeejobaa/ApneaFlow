const instructorsService = require('./instructors.service');
const { updateProfileSchema } = require('./instructors.schema');

/**
 * GET /api/instructors
 * Public — retourne tous les instructeurs avec leur profil.
 */
async function list(req, res, next) {
  try {
    const instructeurs = await instructorsService.list();
    res.json(instructeurs);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/instructors/me
 * Protégé (INSTRUCTEUR) — met à jour le profil de l'instructeur connecté.
 */
async function updateMyProfile(req, res, next) {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors?.[0]?.message ?? 'Validation error',
        code: 'BAD_REQUEST',
      });
    }
    const updated = await instructorsService.updateMyProfile(req.user.id, parsed.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, updateMyProfile };
