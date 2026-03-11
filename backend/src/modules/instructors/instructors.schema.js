const { z } = require('zod');

// Schema de validation pour la mise à jour du profil instructeur.
// Tous les champs sont optionnels : l'instructeur peut ne mettre à jour
// qu'un seul champ à la fois (ex: juste la bio).
const updateProfileSchema = z.object({
  name:     z.string().min(1).max(100).optional(),
  bio:      z.string().max(1000).optional(),
  photoUrl: z.string().url('URL invalide').optional().or(z.literal('')),
});

module.exports = { updateProfileSchema };
