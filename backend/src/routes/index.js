const { Router } = require('express');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

const authController = require('../modules/auth/auth.controller');
const coursesController = require('../modules/courses/courses.controller');
const enrollmentsController = require('../modules/enrollments/enrollments.controller');
const instructorsController = require('../modules/instructors/instructors.controller');
const usersController       = require('../modules/users/users.controller');
const { upload } = require('../config/upload');

const router = Router();

// Auth (public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Courses (public read)
router.get('/courses', coursesController.list);
router.get('/courses/:id', coursesController.getById);

// Course creation (INSTRUCTEUR only)
router.post(
  '/courses',
  authenticateJWT,
  requireRole('INSTRUCTEUR'),
  coursesController.create
);

// Enrollment (ELEVE only)
router.post(
  '/courses/:id/enroll',
  authenticateJWT,
  requireRole('ELEVE'),
  enrollmentsController.enroll
);

// My enrollments (authenticated, typically ELEVE)
router.get(
  '/me/enrollments',
  authenticateJWT,
  enrollmentsController.getMyEnrollments
);

// Mon compte (tous rôles) — nom, email, mot de passe
router.patch('/users/me', authenticateJWT, usersController.updateMe);

// Instructors (public read)
router.get('/instructors', instructorsController.list);

// Update own instructor profile (INSTRUCTEUR only)
router.patch(
  '/instructors/me',
  authenticateJWT,
  requireRole('INSTRUCTEUR'),
  instructorsController.updateMyProfile
);

// Upload photo de profil (INSTRUCTEUR only)
// upload.single('photo') = multer traite UN fichier dont le champ s'appelle "photo"
router.post(
  '/instructors/me/photo',
  authenticateJWT,
  requireRole('INSTRUCTEUR'),
  upload.single('photo'),
  instructorsController.uploadPhoto
);

module.exports = router;
