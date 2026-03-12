const { z } = require('zod');

const updateMeSchema = z.object({
  name:            z.string().min(1).max(100).optional(),
  email:           z.string().email({ message: 'Email invalide' }).optional(),
  currentPassword: z.string().optional(),
  newPassword:     z.string().min(8, { message: 'Le mot de passe doit faire au moins 8 caractères' }).optional(),
})
// Règle métier : si newPassword est fourni, currentPassword est obligatoire
.refine(
  (data) => !(data.newPassword && !data.currentPassword),
  { message: 'Le mot de passe actuel est requis pour en définir un nouveau', path: ['currentPassword'] }
);

module.exports = { updateMeSchema };
