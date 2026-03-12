const bcrypt = require('bcrypt');
const { prisma } = require('../../config/prisma');

// Champs qu'on renvoie — jamais le passwordHash
const SAFE_SELECT = {
  id:       true,
  name:     true,
  email:    true,
  role:     true,
  bio:      true,
  photoUrl: true,
};

async function updateMe(userId, data) {
  // On récupère l'utilisateur actuel pour les vérifications
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('Utilisateur introuvable');
    err.status = 404;
    throw err;
  }

  // Objet qu'on va passer à Prisma — on le construit progressivement
  const update = {};

  // ── Nom ───────────────────────────────────────────────────────────────────
  if (data.name !== undefined) {
    update.name = data.name;
  }

  // ── Email ─────────────────────────────────────────────────────────────────
  if (data.email !== undefined && data.email !== user.email) {
    // On vérifie que le nouvel email n'est pas déjà utilisé par quelqu'un d'autre
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const err = new Error('Cet email est déjà utilisé');
      err.status = 400;
      err.code = 'EMAIL_TAKEN';
      throw err;
    }
    update.email = data.email;
  }

  // ── Mot de passe ──────────────────────────────────────────────────────────
  if (data.newPassword) {
    // On vérifie que l'ancien mot de passe est correct avant d'accepter le nouveau
    // bcrypt.compare compare le mot de passe en clair avec le hash stocké
    const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!valid) {
      const err = new Error('Mot de passe actuel incorrect');
      err.status = 400;
      err.code = 'INVALID_PASSWORD';
      throw err;
    }
    // On hash le nouveau mot de passe avant de le stocker
    update.passwordHash = await bcrypt.hash(data.newPassword, 12);
  }

  return prisma.user.update({
    where: { id: userId },
    data:  update,
    select: SAFE_SELECT,
  });
}

module.exports = { updateMe };
