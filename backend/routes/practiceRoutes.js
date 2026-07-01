const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getPracticeDashboard,
  submitCodingChallenge,
  submitAptitudeQuiz
} = require('../controllers/practiceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/questions', getQuestions);
router.get('/dashboard', getPracticeDashboard);
router.post('/coding/:id', submitCodingChallenge);
router.post('/aptitude', submitAptitudeQuiz);

module.exports = router;
