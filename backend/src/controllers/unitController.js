const { Unit, Question } = require('../models');

// Lấy danh sách tất cả Unit (có filter theo level)
const getUnits = async (req, res) => {
    try {
        const { level } = req.query; // Lấy tham số ?level=B2 hoặc ?level=C1

        const whereClause = {};
        if (level) {
            whereClause.book_level = level.toUpperCase();
        }

        const units = await Unit.findAll({
            where: whereClause,
            order: [['unit_number', 'ASC']],
            attributes: ['id', 'book_level', 'unit_number', 'title', 'type', 'description']
        });

        res.status(200).json({
            message: 'Lấy danh sách Unit thành công',
            count: units.length,
            units
        });

    } catch (error) {
        console.error('Get units error:', error);
        res.status(500).json({
            message: 'Lỗi lấy danh sách Unit'
        });
    }
};

// Lấy chi tiết 1 Unit (kèm lý thuyết và số lượng câu hỏi)
const getUnitById = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findByPk(id, {
            attributes: ['id', 'book_level', 'unit_number', 'title', 'type', 'description', 'content_html']
        });

        if (!unit) {
            return res.status(404).json({
                message: 'Không tìm thấy Unit'
            });
        }

        // Đếm số câu hỏi trong Unit này
        const questionCount = await Question.count({
            where: { unit_id: id }
        });

        res.status(200).json({
            message: 'Lấy chi tiết Unit thành công',
            unit,
            questionCount
        });

    } catch (error) {
        console.error('Get unit by id error:', error);
        res.status(500).json({
            message: 'Lỗi lấy chi tiết Unit'
        });
    }
};

module.exports = {
    getUnits,
    getUnitById
};