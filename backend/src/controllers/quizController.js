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

module.exports = {
    getQuestions,
    submitQuiz
};