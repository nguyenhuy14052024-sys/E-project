const express = require('express');
const router = express.Router();
const { submitOnboarding, getOnboardingStatus } = require('../controllers/onboardingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, submitOnboarding);
router.get('/status', authMiddleware, getOnboardingStatus);

module.exports = router;