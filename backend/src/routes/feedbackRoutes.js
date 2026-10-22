const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Route cho user gửi góp ý (Không bắt buộc đăng nhập, dùng middleware tuỳ chọn)
// Để đơn giản, ta sẽ gắn authMiddleware nhưng cho phép lỗi (nếu bạn muốn bắt buộc đăng nhập thì giữ nguyên)
router.post('/', authMiddleware, submitFeedback); 

// Route cho Admin xem
router.get('/', authMiddleware, isAdmin, getAllFeedbacks);

module.exports = router;