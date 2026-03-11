const { z } = require('zod');

const CourseNameEnum = z.enum([
  'INITIATION', 'AIDA1', 'AIDA2', 'AIDA3', 'AIDA4', 'AIDA_INSTRUCTEUR',
]);
const LocationEnum = z.enum(['PISCINE', 'MER', 'BLUE_HOLE']);
const CourseTypeEnum = z.enum([
  'STATIQUE', 'DYNAMIQUE_PALMES', 'DYNAMIQUE_SANS_PALMES',
  'PROFONDEUR_PALMES', 'PROFONDEUR_SANS_PALMES', 'IMMERSION_LIBRE',
  'POIDS_VARIABLE', 'NO_LIMITS',
]);

const createCourseSchema = z.object({
  title: CourseNameEnum,
  description: z.string().min(1, 'Description is required'),
  date: z.coerce.date(),
  location: LocationEnum,
  type: CourseTypeEnum,
  capacity: z.number().int().min(1).max(4),
});

module.exports = { createCourseSchema };
