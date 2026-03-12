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

/**
 * POST /api/instructors/me/photo
 * Protégé (INSTRUCTEUR) — reçoit un fichier image et met à jour photoUrl.
 * Multer a déjà traité le fichier avant d'arriver ici :
 * req.file contient les infos du fichier uploadé.
 */
async function uploadPhoto(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu', code: 'BAD_REQUEST' });
    }

    // On construit l'URL publique du fichier
    // req.file.filename = le nom généré par multer (ex: "1710000000000-123456.jpg")
    // L'URL finale sera : http://localhost:4000/uploads/1710000000000-123456.jpg
    const photoUrl = `/uploads/${req.file.filename}`;

    const updated = await instructorsService.updateMyProfile(req.user.id, { photoUrl });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, updateMyProfile, uploadPhoto };
