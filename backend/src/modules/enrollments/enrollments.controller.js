const enrollmentsService = require('./enrollments.service');
const { enrollSchema } = require('./enrollments.schema');

async function enroll(req, res, next) {
  try {
    const parsed = enrollSchema.safeParse(req.body ?? {});
    const withEquipment = parsed.success ? parsed.data.withEquipment : false;
    const enrollment = await enrollmentsService.enroll(
      req.params.id,
      req.user.id,
      withEquipment
    );
    res.status(201).json(enrollment);
  } catch (err) {
    if (err.status === 401) {
      return res.status(401).json({ message: err.message, code: err.code });
    }
    if (err.status === 403) {
      return res.status(403).json({ message: err.message, code: err.code });
    }
    if (err.status === 404) {
      return res.status(404).json({ message: err.message, code: err.code });
    }
    if (err.status === 409) {
      return res.status(409).json({ message: err.message, code: err.code });
    }
    next(err);
  }
}

async function getMyEnrollments(req, res, next) {
  try {
    const enrollments = await enrollmentsService.getMyEnrollments(req.user.id);
    res.json(enrollments);
  } catch (err) {
    if (err.status === 401) {
      return res.status(401).json({ message: err.message, code: err.code });
    }
    next(err);
  }
}

module.exports = { enroll, getMyEnrollments };
