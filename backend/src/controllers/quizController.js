const { Question, UserAnswer, Unit } = require('../models');

// Lấy câu hỏi của 1 Unit (ẩn đáp án)
const getQuestions = async (req, res) => {
    try {
        const { unitId } = req.params;

        // Kiểm tra Unit có tồn tại không
        const unit = await Unit.findByPk(unitId);
        if (!unit) {
            return res.status(404).json({ message: 'Không tìm thấy Unit' });
        }

        // Lấy câu hỏi của Unit
        const questions = await Question.findAll({
            where: { unit_id: unitId },
            attributes: { exclude: ['correct_answer', 'explanation'] } // Ẩn đáp án
        });

        res.status(200).json({
            message: 'Lấy câu hỏi thành công',
            unit: {
                id: unit.id,
                title: unit.title,
                unit_number: unit.unit_number
            },
            totalQuestions: questions.length,
            questions
        });

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Lỗi lấy câu hỏi' });
    }
};

// Nộp bài và chấm điểm
const submitQuiz = async (req, res) => {
    try {
        const { userId } = req.user; // Lấy từ middleware auth
        const { unitId, answers } = req.body; // answers: [{questionId, userAnswer}]

        if (!unitId || !answers || answers.length === 0) {
            return res.status(400).json({ message: 'Thiếu thông tin bài làm' });
        }

        // Lấy tất cả câu hỏi của Unit
        const questions = await Question.findAll({
            where: { unit_id: unitId }
        });

        let correctCount = 0;
        const results = [];

        // Duyệt từng câu trả lời
        for (const answer of answers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) continue;

            const isCorrect = question.correct_answer === answer.userAnswer;
            if (isCorrect) correctCount++;

            // Lưu lịch sử làm bài
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
                explanation: question.explanation // Gửi kèm giải thích
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

module.exports = {
    getQuestions,
    submitQuiz
};