const { prisma } = require('../../config/prisma');

async function enroll(courseId, userId, withEquipment = false) {
  if (!userId) {
    const err = new Error('Unauthorized');
    err.status = 401;
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'ELEVE') {
    const err = new Error('Forbidden');
    err.status = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    const err = new Error('Course not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const count = await prisma.enrollment.count({ where: { courseId } });
  if (count >= course.capacity) {
    const err = new Error('Cours complet');
    err.status = 409;
    err.code = 'COURSE_FULL';
    throw err;
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) {
    const err = new Error('Déjà inscrit');
    err.status = 409;
    err.code = 'ALREADY_ENROLLED';
    throw err;
  }

  return prisma.enrollment.create({
    data: { userId, courseId, withEquipment },
    include: {
      course: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

async function getMyEnrollments(userId) {
  if (!userId) {
    const err = new Error('Unauthorized');
    err.status = 401;
    err.code = 'UNAUTHORIZED';
    throw err;
  }
  return prisma.enrollment.findMany({
    where: { userId },
    include: { course: { include: { createdBy: { select: { id: true, name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { enroll, getMyEnrollments };
