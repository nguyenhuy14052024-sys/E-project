const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile, 
    forgotPassword, 
    resetPassword, 
    verifyEmail 
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

// Quên mật khẩu + Xác thực email
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;