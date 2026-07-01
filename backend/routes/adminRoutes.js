const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getStudents,
  createDrive,
  deleteDrive,
  createQuestion,
  deleteQuestion,
  getApplications,
  updateApplicationStatus
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/students', getStudents);
router.route('/drives')
  .post(createDrive);
router.route('/drives/:id')
  .delete(deleteDrive);
router.route('/questions')
  .post(createQuestion);
router.route('/questions/:id')
  .delete(deleteQuestion);
router.route('/applications')
  .get(getApplications);
router.route('/applications/:id')
  .put(updateApplicationStatus);

module.exports = router;
