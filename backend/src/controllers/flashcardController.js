const { Flashcard } = require('../models');
const { Op } = require('sequelize');  // ← THÊM DÒNG NÀY

// Thêm flashcard mới
const createFlashcard = async (req, res) => {
    try {
        const { userId } = req.user;
        const { word, definition, example, unitId } = req.body;

        console.log('📝 Nhận request tạo flashcard:', { word, definition });

        if (!word || !definition) {
            return res.status(400).json({ message: 'Vui lòng nhập từ và định nghĩa' });
        }

        const flashcard = await Flashcard.create({
            user_id: userId,
            word,
            definition,
            example: example || null,
            unit_id: unitId || null
        });

        console.log('✅ Flashcard đã tạo:', flashcard.id);

        res.status(201).json({
            message: 'Thêm flashcard thành công',
            flashcard
        });

    } catch (error) {
        console.error('❌ Create flashcard error:', error);
        res.status(500).json({ 
            message: 'Lỗi thêm flashcard',
            error: error.message 
        });
    }
};

// Lấy danh sách flashcard của người dùng
const getFlashcards = async (req, res) => {
    try {
        const { userId } = req.user;
        const { limit = 50, offset = 0 } = req.query;

        const flashcards = await Flashcard.findAll({
            where: { user_id: userId },
            order: [['next_review', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            message: 'Lấy danh sách flashcard thành công',
            flashcards
        });

    } catch (error) {
        console.error('Get flashcards error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách flashcard' });
    }
};

// Lấy chi tiết 1 flashcard
const getFlashcardById = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const flashcard = await Flashcard.findOne({
            where: { id, user_id: userId }
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Không tìm thấy flashcard' });
        }

        res.status(200).json({
            message: 'Lấy flashcard thành công',
            flashcard
        });

    } catch (error) {
        console.error('Get flashcard by id error:', error);
        res.status(500).json({ message: 'Lỗi lấy flashcard' });
    }
};

// Cập nhật flashcard
const updateFlashcard = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const { word, definition, example, unitId } = req.body;

        const flashcard = await Flashcard.findOne({
            where: { id, user_id: userId }
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Không tìm thấy flashcard' });
        }

        if (word) flashcard.word = word;
        if (definition) flashcard.definition = definition;
        if (example !== undefined) flashcard.example = example;
        if (unitId !== undefined) flashcard.unit_id = unitId;

        await flashcard.save();

        res.status(200).json({
            message: 'Cập nhật flashcard thành công',
            flashcard
        });

    } catch (error) {
        console.error('Update flashcard error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật flashcard' });
    }
};

// Xóa flashcard
const deleteFlashcard = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const flashcard = await Flashcard.findOne({
            where: { id, user_id: userId }
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Không tìm thấy flashcard' });
        }

        await flashcard.destroy();

        res.status(200).json({
            message: 'Xóa flashcard thành công'
        });

    } catch (error) {
        console.error('Delete flashcard error:', error);
        res.status(500).json({ message: 'Lỗi xóa flashcard' });
    }
};

// Lấy flashcard đến hạn ôn tập
const getDueFlashcards = async (req, res) => {
    try {
        const { userId } = req.user;
        const { limit = 20 } = req.query;

        const flashcards = await Flashcard.findAll({
            where: {
                user_id: userId,
                next_review: {
                    [Op.lte]: new Date()  // next_review <= now
                }
            },
            order: [['next_review', 'ASC']],
            limit: parseInt(limit)
        });
        
        console.log('✅ Flashcards due:', flashcards.length);  // ← THÊM LOG

        res.status(200).json({
            message: 'Lấy flashcard đến hạn thành công',
            flashcards,
            count: flashcards.length
        });

    } catch (error) {
        console.error('Get due flashcards error:', error);
        res.status(500).json({ message: 'Lỗi lấy flashcard đến hạn' });
    }
};

// Cập nhật flashcard sau khi ôn tập (Spaced Repetition)
const reviewFlashcard = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const { quality } = req.body;  // 0=Again, 1=Hard, 2=Good, 3=Easy

        if (quality === undefined || quality < 0 || quality > 3) {
            return res.status(400).json({ message: 'Vui lòng chọn đánh giá (0-3)' });
        }

        const flashcard = await Flashcard.findOne({
            where: { id, user_id: userId }
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Không tìm thấy flashcard' });
        }

        // Thuật toán SM-2
        let { ease_factor, interval, next_review } = flashcard;

        // Cập nhật ease_factor
        const qualityMap = { 0: 0, 1: 0, 2: 0.1, 3: 0.3 };
        ease_factor = Math.max(1.3, ease_factor + qualityMap[quality] - 0.3);

        // Cập nhật interval
        if (quality === 0 || quality === 1) {
            interval = 0;  // Reset
            next_review = new Date(Date.now() + 60 * 60 * 1000);  // 1 giờ sau
        } else {
            if (interval === 0) {
                interval = 1;  // 1 ngày
            } else if (interval === 1) {
                interval = 6;  // 6 ngày
            } else {
                interval = Math.round(interval * ease_factor);
            }
            next_review = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
        }

        await flashcard.update({
            ease_factor,
            interval,
            next_review
        });

        res.status(200).json({
            message: 'Cập nhật flashcard thành công',
            flashcard
        });

    } catch (error) {
        console.error('Review flashcard error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật flashcard' });
    }
};

module.exports = {
    createFlashcard,
    getFlashcards,
    getFlashcardById,
    updateFlashcard,
    deleteFlashcard,
    getDueFlashcards,    // ← PHẢI CÓ
    reviewFlashcard      // ← PHẢI CÓ
};