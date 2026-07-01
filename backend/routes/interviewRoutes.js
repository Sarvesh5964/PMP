const express = require('express');
const router = express.Router();
const { startInterview, submitInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startInterview);
router.post('/submit', submitInterview);

module.exports = router;
