const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/prisma');
const { env } = require('../../config/env');

async function register(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    const err = new Error('Email already taken');
    err.status = 400;
    err.code = 'EMAIL_TAKEN';
    throw err;
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    },
  });
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

async function login(data) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

module.exports = { register, login };
