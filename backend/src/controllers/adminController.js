const { Unit, Question, User } = require('../models');

// ==================== QUẢN LÝ UNIT ====================

// Lấy tất cả Unit (bao gồm cả số câu hỏi)
const getAllUnits = async (req, res) => {
    try {
        const units = await Unit.findAll({
            order: [['book_level', 'ASC'], ['unit_number', 'ASC']]
        });

        // Đếm số câu hỏi cho từng Unit
        const unitsWithCount = await Promise.all(units.map(async (unit) => {
            const questionCount = await Question.count({
                where: { unit_id: unit.id }
            });
            return {
                ...unit.toJSON(),
                questionCount
            };
        }));

        res.status(200).json({
            message: 'Lấy danh sách Unit thành công',
            count: units.length,
            units: unitsWithCount
        });

    } catch (error) {
        console.error('Admin get all units error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách Unit' });
    }
};

// Thêm Unit mới
const createUnit = async (req, res) => {
    try {
        const { book_level, unit_number, title, type, description, content_html } = req.body;

        if (!book_level || !unit_number || !title || !type) {
            return res.status(400).json({ 
                message: 'Vui lòng nhập đầy đủ: book_level, unit_number, title, type' 
            });
        }

        const unit = await Unit.create({
            book_level,
            unit_number,
            title,
            type,
            description,
            content_html
        });

        res.status(201).json({
            message: 'Thêm Unit thành công',
            unit
        });

    } catch (error) {
        console.error('Admin create unit error:', error);
        res.status(500).json({ message: 'Lỗi thêm Unit' });
    }
};

// Cập nhật Unit
const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { book_level, unit_number, title, type, description, content_html } = req.body;

        const unit = await Unit.findByPk(id);
        if (!unit) {
            return res.status(404).json({ message: 'Không tìm thấy Unit' });
        }

        if (book_level) unit.book_level = book_level;
        if (unit_number) unit.unit_number = unit_number;
        if (title) unit.title = title;
        if (type) unit.type = type;
        if (description !== undefined) unit.description = description;
        if (content_html !== undefined) unit.content_html = content_html;

        await unit.save();

        res.status(200).json({
            message: 'Cập nhật Unit thành công',
            unit
        });

    } catch (error) {
        console.error('Admin update unit error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật Unit' });
    }
};

// Xóa Unit (và tất cả câu hỏi của nó)
const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findByPk(id);
        if (!unit) {
            return res.status(404).json({ message: 'Không tìm thấy Unit' });
        }

        // Xóa tất cả câu hỏi của Unit trước
        await Question.destroy({ where: { unit_id: id } });
        
        // Xóa Unit
        await unit.destroy();

        res.status(200).json({
            message: 'Xóa Unit và câu hỏi thành công'
        });

    } catch (error) {
        console.error('Admin delete unit error:', error);
        res.status(500).json({ message: 'Lỗi xóa Unit' });
    }
};

// ==================== QUẢN LÝ CÂU HỎI ====================

// Lấy câu hỏi theo Unit
const getQuestionsByUnit = async (req, res) => {
    try {
        const { unitId } = req.params;

        const questions = await Question.findAll({
            where: { unit_id: unitId },
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json({
            message: 'Lấy danh sách câu hỏi thành công',
            count: questions.length,
            questions
        });

    } catch (error) {
        console.error('Admin get questions error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách câu hỏi' });
    }
};

// Thêm câu hỏi mới
const createQuestion = async (req, res) => {
    try {
        const { 
            unit_id, question_type, content, options, 
            correct_answer, explanation, difficulty 
        } = req.body;

        if (!unit_id || !question_type || !content || !correct_answer) {
            return res.status(400).json({ 
                message: 'Vui lòng nhập: unit_id, question_type, content, correct_answer' 
            });
        }

        const question = await Question.create({
            unit_id,
            question_type,
            content,
            options: options || null,
            correct_answer,
            explanation,
            difficulty: difficulty || 1
        });

        res.status(201).json({
            message: 'Thêm câu hỏi thành công',
            question
        });

    } catch (error) {
        console.error('Admin create question error:', error);
        res.status(500).json({ message: 'Lỗi thêm câu hỏi' });
    }
};

// Cập nhật câu hỏi
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            question_type, content, options, 
            correct_answer, explanation, difficulty 
        } = req.body;

        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        }

        if (question_type) question.question_type = question_type;
        if (content) question.content = content;
        if (options !== undefined) question.options = options;
        if (correct_answer) question.correct_answer = correct_answer;
        if (explanation !== undefined) question.explanation = explanation;
        if (difficulty) question.difficulty = difficulty;

        await question.save();

        res.status(200).json({
            message: 'Cập nhật câu hỏi thành công',
            question
        });

    } catch (error) {
        console.error('Admin update question error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật câu hỏi' });
    }
};

// Xóa câu hỏi
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        }

        await question.destroy();

        res.status(200).json({
            message: 'Xóa câu hỏi thành công'
        });

    } catch (error) {
        console.error('Admin delete question error:', error);
        res.status(500).json({ message: 'Lỗi xóa câu hỏi' });
    }
};

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: 'Lấy danh sách người dùng thành công',
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Admin get all users error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách người dùng' });
    }
};

// Cập nhật quyền / Premium cho user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, is_premium, premium_expiry } = req.body;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        if (role) user.role = role;
        if (is_premium !== undefined) user.is_premium = is_premium;
        if (premium_expiry !== undefined) user.premium_expiry = premium_expiry;

        await user.save();

        res.status(200).json({
            message: 'Cập nhật người dùng thành công',
            user
        });

    } catch (error) {
        console.error('Admin update user error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật người dùng' });
    }
};

module.exports = {
    // Unit
    getAllUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    // Question
    getQuestionsByUnit,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    // User
    getAllUsers,
    updateUser
};