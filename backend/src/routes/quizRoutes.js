const express = require('express');
const router = express.Router();
const { getQuestions, submitQuiz, generateMiniTest } = require('../controllers/quizController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// ✅ Route cụ thể - phải đặt TRƯỚC route động
router.post('/generate', authMiddleware, generateMiniTest);  // ← Chuyển lên đầu
router.post('/submit', authMiddleware, submitQuiz);
router.get('/:unitId', authMiddleware, getQuestions);        // ← Để sau cùng

module.exports = router;