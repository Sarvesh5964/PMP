const express = require('express');
const router = express.Router();
const { startInterview, submitInterview, evaluateStep } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startInterview);
router.post('/submit', submitInterview);
router.post('/evaluate-step', evaluateStep);

module.exports = router;
