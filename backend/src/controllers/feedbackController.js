const { Feedback, User } = require('../models');

// User gửi góp ý
const submitFeedback = async (req, res) => {
    try {
        const { content, page_url } = req.body;
        const userId = req.user ? req.user.userId : null; // Lấy từ middleware nếu có

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Nội dung góp ý không được để trống' });
        }

        const feedback = await Feedback.create({
            user_id: userId,
            content,
            page_url: page_url || null
        });

        res.status(201).json({ message: 'Cảm ơn bạn đã gửi góp ý!', feedback });
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ message: 'Lỗi gửi góp ý' });
    }
};

// Admin lấy danh sách góp ý
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error('Get all feedbacks error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách góp ý' });
    }
};

module.exports = { submitFeedback, getAllFeedbacks };