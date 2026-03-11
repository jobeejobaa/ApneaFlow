const { z } = require('zod');

const RoleEnum = z.enum(['ELEVE', 'INSTRUCTEUR']);

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: RoleEnum,
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };
