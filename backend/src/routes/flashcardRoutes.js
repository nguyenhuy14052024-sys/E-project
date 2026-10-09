const express = require('express');
const router = express.Router();
const { 
    createFlashcard, 
    getFlashcards, 
    getFlashcardById,
    updateFlashcard, 
    deleteFlashcard,
    getDueFlashcards,
    getAllFlashcardsForReview,
    reviewFlashcard
} = require('../controllers/flashcardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route cụ thể - đặt trước route động
router.get('/due', authMiddleware, getDueFlashcards);
router.get('/all', authMiddleware, getAllFlashcardsForReview);
router.post('/', authMiddleware, createFlashcard);
router.get('/', authMiddleware, getFlashcards);
router.post('/:id/review', authMiddleware, reviewFlashcard);
router.get('/:id', authMiddleware, getFlashcardById);
router.put('/:id', authMiddleware, updateFlashcard);
router.delete('/:id', authMiddleware, deleteFlashcard);

module.exports = router;