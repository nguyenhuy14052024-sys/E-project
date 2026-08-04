const express = require('express');
const router = express.Router();
const { getQuestions, submitQuiz, generateMiniTest, getErrorLog } = require('../controllers/quizController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route cụ thể - đặt trước route động
router.post('/generate', authMiddleware, generateMiniTest);
router.post('/submit', authMiddleware, submitQuiz);
router.get('/errors', authMiddleware, getErrorLog);  // ← PHẢI CÓ DÒNG NÀY
router.get('/:unitId', authMiddleware, getQuestions);

module.exports = router;