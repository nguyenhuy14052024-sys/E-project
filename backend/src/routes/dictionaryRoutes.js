const express = require('express');
const router = express.Router();
const { lookup } = require('../controllers/dictionaryController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Tra từ (cần đăng nhập)
router.get('/:word', authMiddleware, lookup);

module.exports = router;