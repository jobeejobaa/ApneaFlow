import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure the backend .env wins over variables already exported in the shell,
// regardless of the directory Prisma commands are run from.
dotenv.config({ override: true, path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
  },
});
