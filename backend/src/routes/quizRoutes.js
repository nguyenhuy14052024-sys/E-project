const express = require('express');
const router = express.Router();
const { getQuestions, submitQuiz } = require('../controllers/quizController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Lấy câu hỏi
router.get('/:unitId', authMiddleware, getQuestions);

// Nộp bài
router.post('/submit', authMiddleware, submitQuiz);

module.exports = router;