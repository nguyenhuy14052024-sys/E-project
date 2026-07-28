const { Question, UserAnswer, Unit } = require('../models');

// Lấy câu hỏi của 1 Unit (ẩn đáp án)
const getQuestions = async (req, res) => {
    try {
        const { unitId } = req.params;
        const { type } = req.query;

        console.log('🔍 unitId:', unitId);
        console.log('🔍 type:', type);

        const unit = await Unit.findByPk(unitId);
        if (!unit) {
            console.log('❌ Unit not found');
            return res.status(404).json({ message: 'Không tìm thấy Unit' });
        }

        const whereClause = { unit_id: unitId };
        if (type) {
            whereClause.question_type = type;
        }

        console.log('🔍 whereClause:', whereClause);

        const questions = await Question.findAll({
            where: whereClause,
            attributes: { exclude: ['correct_answer', 'explanation'] }
        });

        console.log('✅ Questions found:', questions.length);

        const finalQuestions = questions
            .map(q => q.toJSON())
            .sort(() => Math.random() - 0.5)
            .map(q => {
                if (q.options && Array.isArray(q.options) && q.options.length > 0) {
                    const shuffled = [...q.options];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    q.options = shuffled;
                }
                return q;
            });

        res.status(200).json({
            message: 'Lấy câu hỏi thành công',
            unit: {
                id: unit.id,
                title: unit.title,
                unit_number: unit.unit_number
            },
            totalQuestions: finalQuestions.length,
            questions: finalQuestions
        });

    } catch (error) {
        console.error('❌ Get questions error DETAIL:', error);
        console.error('❌ Stack:', error.stack);
        res.status(500).json({ 
            message: 'Lỗi lấy câu hỏi',
            error: error.message 
        });
    }
};
// Nộp bài và chấm điểm
const submitQuiz = async (req, res) => {
    try {
        const { userId } = req.user;
        const { unitId, answers } = req.body;

        if (!unitId || !answers || answers.length === 0) {
            return res.status(400).json({ message: 'Thiếu thông tin bài làm' });
        }

        const questions = await Question.findAll({
            where: { unit_id: unitId }
        });

        let correctCount = 0;
        const results = [];

        for (const answer of answers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) continue;

            const isCorrect = question.correct_answer === answer.userAnswer;
            if (isCorrect) correctCount++;

            await UserAnswer.create({
                user_id: userId,
                question_id: answer.questionId,
                user_answer: answer.userAnswer,
                is_correct: isCorrect,
                timestamp: new Date()
            });

            results.push({
                questionId: question.id,
                userAnswer: answer.userAnswer,
                correctAnswer: question.correct_answer,
                isCorrect,
                explanation: question.explanation
            });
        }

        const totalQuestions = questions.length;
        const score = (correctCount / totalQuestions) * 100;

        res.status(200).json({
            message: 'Nộp bài thành công',
            score: Math.round(score * 100) / 100,
            correctCount,
            totalQuestions,
            results
        });

    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ message: 'Lỗi nộp bài' });
    }
};

// Tạo Mini Test: random câu hỏi từ nhiều Unit
const generateMiniTest = async (req, res) => {
    try {
        const { userId } = req.user;
        const { level, questionTypes, count = 10, difficulty } = req.body;

        // Xây dựng điều kiện lọc
        const unitWhere = {};
        if (level) {
            unitWhere.book_level = level.toUpperCase();
        }

        // Lấy tất cả Unit theo level
        const units = await Unit.findAll({
            where: unitWhere,
            attributes: ['id']
        });

        if (units.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy Unit nào' });
        }

        const unitIds = units.map(u => u.id);

        // Xây dựng điều kiện cho câu hỏi
        const questionWhere = {
            unit_id: unitIds
        };
        if (questionTypes && questionTypes.length > 0) {
            questionWhere.question_type = questionTypes;
        }
        if (difficulty) {
            questionWhere.difficulty = difficulty;
        }

        // Lấy câu hỏi
        const questions = await Question.findAll({
            where: questionWhere,
            attributes: { exclude: ['correct_answer', 'explanation'] }
        });

        if (questions.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi nào' });
        }

        // Random và giới hạn số câu
        const shuffled = questions
            .map(q => q.toJSON())
            .sort(() => Math.random() - 0.5)
            .slice(0, count);

        // Shuffle options
        const finalQuestions = shuffled.map(q => {
            if (q.options && Array.isArray(q.options) && q.options.length > 0) {
                const shuffledOpts = [...q.options];
                for (let i = shuffledOpts.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
                }
                q.options = shuffledOpts;
            }
            return q;
        });

        res.status(200).json({
            message: 'Tạo Mini Test thành công',
            totalQuestions: finalQuestions.length,
            questions: finalQuestions,
            testId: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        });

    } catch (error) {
        console.error('Generate mini test error:', error);
        res.status(500).json({ message: 'Lỗi tạo Mini Test' });
    }
};

module.exports = {
    getQuestions,
    submitQuiz,
    generateMiniTest  // ← THÊM DÒNG NÀY
};