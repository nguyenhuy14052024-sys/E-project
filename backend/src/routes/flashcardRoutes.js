const express = require('express');
const router = express.Router();
const { 
    createFlashcard, 
    getFlashcards, 
    getFlashcardById,
    updateFlashcard, 
    deleteFlashcard 
} = require('../controllers/flashcardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createFlashcard);
router.get('/', authMiddleware, getFlashcards);
router.get('/:id', authMiddleware, getFlashcardById);   // ← PHẢI CÓ DÒNG NÀY
router.put('/:id', authMiddleware, updateFlashcard);
router.delete('/:id', authMiddleware, deleteFlashcard);

module.exports = router;