const path = require('path');
require('dotenv').config({
  override: true,
  path: path.resolve(__dirname, '..', '..', '.env'),
});

const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me_super_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

if (!env.databaseUrl) {
  console.warn('DATABASE_URL is not set. Prisma will need it for migrations.');
}

module.exports = { env };
