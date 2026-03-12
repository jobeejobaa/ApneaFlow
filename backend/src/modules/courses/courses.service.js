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

async function update(id, data, userId) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    const err = new Error('Course not found'); err.status = 404; err.code = 'NOT_FOUND'; throw err;
  }
  // Seul l'instructeur qui a créé le cours peut le modifier
  if (course.createdById !== userId) {
    const err = new Error('Forbidden'); err.status = 403; err.code = 'FORBIDDEN'; throw err;
  }
  return prisma.course.update({
    where: { id },
    data: { ...data, ...(data.date && { date: new Date(data.date) }) },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { enrollments: true } },
    },
  });
}

async function remove(id, userId) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    const err = new Error('Course not found'); err.status = 404; err.code = 'NOT_FOUND'; throw err;
  }
  if (course.createdById !== userId) {
    const err = new Error('Forbidden'); err.status = 403; err.code = 'FORBIDDEN'; throw err;
  }
  // On supprime d'abord les inscriptions (contrainte de clé étrangère)
  await prisma.enrollment.deleteMany({ where: { courseId: id } });
  await prisma.course.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
