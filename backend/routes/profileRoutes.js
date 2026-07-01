const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  getRecommendations,
  getDrives,
  applyToDrive,
  getApplications
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.post('/resume', upload.single('resume'), uploadResume);
router.get('/recommendations', getRecommendations);
router.get('/drives', getDrives);
router.post('/drives/:id/apply', applyToDrive);
router.get('/applications', getApplications);

module.exports = router;
