const express = require('express');
const router = express.Router();
const { 
    createFlashcard, 
    getFlashcards, 
    getFlashcardById,
    updateFlashcard, 
    deleteFlashcard,
    getDueFlashcards,
    reviewFlashcard
} = require('../controllers/flashcardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// ✅ Route CỤ THỂ - đặt LÊN TRƯỚC
router.get('/due', authMiddleware, getDueFlashcards);        // ← Đưa lên đầu
router.post('/', authMiddleware, createFlashcard);
router.get('/', authMiddleware, getFlashcards);
router.post('/:id/review', authMiddleware, reviewFlashcard);
router.get('/:id', authMiddleware, getFlashcardById);
router.put('/:id', authMiddleware, updateFlashcard);
router.delete('/:id', authMiddleware, deleteFlashcard);

module.exports = router;