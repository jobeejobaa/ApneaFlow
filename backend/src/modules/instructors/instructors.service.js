const { prisma } = require('../../config/prisma');

// Champs publics qu'on expose sur un instructeur
// On ne renvoie JAMAIS passwordHash
const PUBLIC_FIELDS = {
  id:       true,
  name:     true,
  email:    true,
  bio:      true,
  photoUrl: true,
};

/**
 * Retourne tous les utilisateurs avec le rôle INSTRUCTEUR.
 * Route publique — pas de token requis.
 */
async function list() {
  return prisma.user.findMany({
    where: { role: 'INSTRUCTEUR' },
    select: PUBLIC_FIELDS,
    orderBy: { name: 'asc' },
  });
}

/**
 * Met à jour le profil de l'instructeur connecté (bio, photoUrl, name).
 * Seul l'instructeur lui-même peut modifier son propre profil.
 */
async function updateMyProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name     !== undefined && { name:     data.name }),
      ...(data.bio      !== undefined && { bio:      data.bio }),
      ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
    },
    select: PUBLIC_FIELDS,
  });
}

module.exports = { list, updateMyProfile };
