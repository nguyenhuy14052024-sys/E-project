const { Flashcard } = require('../models');

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

module.exports = {
    createFlashcard,
    getFlashcards,
    getFlashcardById,
    updateFlashcard,
    deleteFlashcard
};