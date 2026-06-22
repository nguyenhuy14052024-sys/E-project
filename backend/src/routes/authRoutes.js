const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Lấy profile (cần đăng nhập)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;