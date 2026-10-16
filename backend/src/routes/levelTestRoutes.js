const express = require('express');
const router = express.Router();
const {
    getAllLevelTests,
    getLevelTestById,
    createLevelTest,
    updateLevelTest,
    deleteLevelTest,
    getQuestionsByTest,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createPassage,
    updatePassage,
    deletePassage,
    getTestForUser,
    submitTest,
    getMyAttempts,
    getAttemptById
} = require('../controllers/levelTestController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');

// ==================== USER ROUTES ====================
router.get('/my-attempts', authMiddleware, getMyAttempts);
router.get('/attempts/:id', authMiddleware, getAttemptById);
router.get('/take/:id', authMiddleware, getTestForUser);
router.post('/submit', authMiddleware, submitTest);

// ==================== ADMIN ROUTES ====================
router.get('/', authMiddleware, isAdmin, getAllLevelTests);
router.post('/', authMiddleware, isAdmin, createLevelTest);
router.get('/:id', authMiddleware, isAdmin, getLevelTestById);
router.put('/:id', authMiddleware, isAdmin, updateLevelTest);
router.delete('/:id', authMiddleware, isAdmin, deleteLevelTest);

// Questions
router.get('/:testId/questions', authMiddleware, isAdmin, getQuestionsByTest);
router.post('/questions', authMiddleware, isAdmin, createQuestion);
router.put('/questions/:id', authMiddleware, isAdmin, updateQuestion);
router.delete('/questions/:id', authMiddleware, isAdmin, deleteQuestion);

// Passages
router.post('/passages', authMiddleware, isAdmin, createPassage);
router.put('/passages/:id', authMiddleware, isAdmin, updatePassage);
router.delete('/passages/:id', authMiddleware, isAdmin, deletePassage);

module.exports = router;