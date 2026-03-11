const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const path = require('path');
const fs = require('fs');

require('dotenv').config({
  override: true,
  path: path.resolve(__dirname, '..', '..', '.env'),
});

function readDatabaseUrlFromEnvFile() {
  const envPath = path.resolve(__dirname, '..', '..', '.env');
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    const line = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && l.startsWith('DATABASE_URL='));
    if (!line) return null;
    let value = line.slice('DATABASE_URL='.length).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value || null;
  } catch {
    return null;
  }
}

const connectionString =
  readDatabaseUrlFromEnvFile() ||
  process.env.DATABASE_URL ||
  'postgresql://localhost:5432/apneaflow';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
