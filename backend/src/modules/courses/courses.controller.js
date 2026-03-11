const coursesService = require('./courses.service');
const { createCourseSchema } = require('./courses.schema');

async function list(req, res, next) {
  try {
    const courses = await coursesService.list();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const course = await coursesService.getById(req.params.id);
    res.json(course);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ message: err.message, code: err.code });
    }
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = createCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors?.[0]?.message ?? 'Validation error',
        code: 'BAD_REQUEST',
      });
    }
    const course = await coursesService.create(parsed.data, req.user?.id);
    res.status(201).json(course);
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ message: err.message, code: err.code });
    }
    next(err);
  }
}

module.exports = { list, getById, create };
