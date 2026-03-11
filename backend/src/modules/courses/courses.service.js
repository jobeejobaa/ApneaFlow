const { prisma } = require('../../config/prisma');

async function list() {
  return prisma.course.findMany({
    orderBy: { date: 'asc' },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { enrollments: true } },
    },
  });
}

async function getById(id) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) {
    const err = new Error('Course not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  return course;
}

async function create(data, createdById) {
  if (!createdById) {
    const err = new Error('Forbidden');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }
  return prisma.course.create({
    data: {
      ...data,
      date: new Date(data.date),
      createdById,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });
}

module.exports = { list, getById, create };
