const { LevelTest, LevelTestQuestion, ReadingPassage, LevelTestAttempt, User } = require('../models');
const { Op } = require('sequelize');
const { issueCertificate } = require('./profileController');

// ==================== ADMIN: QUẢN LÝ LEVEL TEST ====================

const getAllLevelTests = async (req, res) => {
    try {
        const tests = await LevelTest.findAll({ order: [['book_level', 'ASC'], ['createdAt', 'DESC']] });
        const testsWithCount = await Promise.all(tests.map(async (test) => {
            const questionCount = await LevelTestQuestion.count({ where: { level_test_id: test.id } });
            const attemptCount = await LevelTestAttempt.count({ where: { level_test_id: test.id } });
            return { ...test.toJSON(), questionCount, attemptCount };
        }));
        res.status(200).json({ message: 'Lấy danh sách Level Test thành công', count: tests.length, tests: testsWithCount });
    } catch (error) {
        console.error('Get all level tests error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách Level Test' });
    }
};

const getLevelTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await LevelTest.findByPk(id, {
            include: [
                { model: ReadingPassage, as: 'passages' },
                { model: LevelTestQuestion, as: 'questions', order: [['order', 'ASC']] }
            ]
        });
        if (!test) return res.status(404).json({ message: 'Không tìm thấy Level Test' });
        res.status(200).json({ message: 'Lấy chi tiết Level Test thành công', test });
    } catch (error) {
        console.error('Get level test by id error:', error);
        res.status(500).json({ message: 'Lỗi lấy chi tiết Level Test' });
    }
};

const createLevelTest = async (req, res) => {
    try {
        const { book_level, title, description, total_score, duration, total_questions } = req.body;
        if (!book_level || !title) return res.status(400).json({ message: 'Vui lòng nhập book_level và title' });
        const test = await LevelTest.create({
            book_level, title, description, total_score: total_score || 100, duration: duration || 60, total_questions: total_questions || 0
        });
        res.status(201).json({ message: 'Tạo Level Test thành công', test });
    } catch (error) {
        console.error('Create level test error:', error);
        res.status(500).json({ message: 'Lỗi tạo Level Test' });
    }
};

const updateLevelTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { book_level, title, description, total_score, duration, total_questions } = req.body;
        const test = await LevelTest.findByPk(id);
        if (!test) return res.status(404).json({ message: 'Không tìm thấy Level Test' });

        if (book_level) test.book_level = book_level;
        if (title) test.title = title;
        if (description !== undefined) test.description = description;
        if (total_score !== undefined) test.total_score = total_score;
        if (duration !== undefined) test.duration = duration;
        if (total_questions !== undefined) test.total_questions = total_questions;

        await test.save();
        res.status(200).json({ message: 'Cập nhật Level Test thành công', test });
    } catch (error) {
        console.error('Update level test error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật Level Test' });
    }
};

const deleteLevelTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await LevelTest.findByPk(id);
        if (!test) return res.status(404).json({ message: 'Không tìm thấy Level Test' });

        await LevelTestQuestion.destroy({ where: { level_test_id: id } });
        await ReadingPassage.destroy({ where: { level_test_id: id } });
        await LevelTestAttempt.destroy({ where: { level_test_id: id } });
        await test.destroy();
        res.status(200).json({ message: 'Xóa Level Test thành công' });
    } catch (error) {
        console.error('Delete level test error:', error);
        res.status(500).json({ message: 'Lỗi xóa Level Test' });
    }
};

const getQuestionsByTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const questions = await LevelTestQuestion.findAll({ where: { level_test_id: testId }, order: [['order', 'ASC']] });
        res.status(200).json({ message: 'Lấy danh sách câu hỏi thành công', count: questions.length, questions });
    } catch (error) {
        console.error('Get questions by test error:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách câu hỏi' });
    }
};

const createQuestion = async (req, res) => {
    try {
        const {
            level_test_id, passage_id, question_group, section, content,
            underlined, options, correct_answer, explanation, score, order,
            prefix, suffix
        } = req.body;

        if (!level_test_id || !question_group || !content || !correct_answer) {
            return res.status(400).json({ message: 'Vui lòng nhập level_test_id, question_group, content, correct_answer' });
        }

        const question = await LevelTestQuestion.create({
            level_test_id, passage_id: passage_id || null,
            question_group, section: section || 'SECTION A',
            content, prefix: prefix || null, suffix: suffix || null,
            underlined, options, correct_answer, explanation,
            score: score || 1, order: order || 0
        });

        const totalQuestions = await LevelTestQuestion.count({ where: { level_test_id } });
        await LevelTest.update({ total_questions: totalQuestions }, { where: { id: level_test_id } });

        res.status(201).json({ message: 'Tạo câu hỏi thành công', question });
    } catch (error) {
        console.error('Create level test question error:', error);
        res.status(500).json({ message: 'Lỗi tạo câu hỏi' });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            question_group, section, content, underlined, options,
            correct_answer, explanation, score, order, prefix, suffix
        } = req.body;

        const question = await LevelTestQuestion.findByPk(id);
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });

        if (question_group) question.question_group = question_group;
        if (section !== undefined) question.section = section;
        if (content) question.content = content;
        if (prefix !== undefined) question.prefix = prefix;
        if (suffix !== undefined) question.suffix = suffix;
        if (underlined !== undefined) question.underlined = underlined;
        if (options !== undefined) question.options = options;
        if (correct_answer) question.correct_answer = correct_answer;
        if (explanation !== undefined) question.explanation = explanation;
        if (score !== undefined) question.score = score;
        if (order !== undefined) question.order = order;

        await question.save();
        res.status(200).json({ message: 'Cập nhật câu hỏi thành công', question });
    } catch (error) {
        console.error('Update level test question error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật câu hỏi' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await LevelTestQuestion.findByPk(id);
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });

        const levelTestId = question.level_test_id;
        await question.destroy();

        const totalQuestions = await LevelTestQuestion.count({ where: { level_test_id: levelTestId } });
        await LevelTest.update({ total_questions: totalQuestions }, { where: { id: levelTestId } });

        res.status(200).json({ message: 'Xóa câu hỏi thành công' });
    } catch (error) {
        console.error('Delete level test question error:', error);
        res.status(500).json({ message: 'Lỗi xóa câu hỏi' });
    }
};

const createPassage = async (req, res) => {
    try {
        const { level_test_id, title, content, image_url, image_width, source, questions } = req.body;
        if (!level_test_id || !content) return res.status(400).json({ message: 'Vui lòng nhập level_test_id và content' });

        const passage = await ReadingPassage.create({ level_test_id, title, content, image_url, image_width: image_width || '100%', source });

        const createdQuestions = [];
        if (questions && Array.isArray(questions) && questions.length > 0) {
            for (const q of questions) {
                if (!q.question_group || !q.content || !q.correct_answer) continue;
                const newQuestion = await LevelTestQuestion.create({
                    level_test_id, passage_id: passage.id,
                    question_group: q.question_group, section: q.section || 'SECTION A',
                    content: q.content, prefix: q.prefix || null, suffix: q.suffix || null,
                    underlined: q.underlined || null, options: q.options || null,
                    correct_answer: q.correct_answer, explanation: q.explanation || null,
                    score: q.score || 1, order: q.order || 0
                });
                createdQuestions.push(newQuestion);
            }
            const totalQuestions = await LevelTestQuestion.count({ where: { level_test_id } });
            await LevelTest.update({ total_questions: totalQuestions }, { where: { id: level_test_id } });
        }
        res.status(201).json({ message: 'Tạo bài đọc thành công', passage, questions: createdQuestions });
    } catch (error) {
        console.error('Create reading passage error:', error);
        res.status(500).json({ message: 'Lỗi tạo bài đọc' });
    }
};

const updatePassage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image_url, image_width, source, questions } = req.body;
        const passage = await ReadingPassage.findByPk(id);
        if (!passage) return res.status(404).json({ message: 'Không tìm thấy bài đọc' });

        if (title !== undefined) passage.title = title;
        if (content) passage.content = content;
        if (image_url !== undefined) passage.image_url = image_url;
        if (image_width !== undefined) passage.image_width = image_width;
        if (source !== undefined) passage.source = source;
        await passage.save();

        if (questions !== undefined) {
            await LevelTestQuestion.destroy({ where: { passage_id: id } });
            if (Array.isArray(questions) && questions.length > 0) {
                for (const q of questions) {
                    if (!q.question_group || !q.content || !q.correct_answer) continue;
                    await LevelTestQuestion.create({
                        level_test_id: passage.level_test_id, passage_id: passage.id,
                        question_group: q.question_group, section: q.section || 'SECTION A',
                        content: q.content, prefix: q.prefix || null, suffix: q.suffix || null,
                        underlined: q.underlined || null, options: q.options || null,
                        correct_answer: q.correct_answer, explanation: q.explanation || null,
                        score: q.score || 1, order: q.order || 0
                    });
                }
            }
            const totalQuestions = await LevelTestQuestion.count({ where: { level_test_id: passage.level_test_id } });
            await LevelTest.update({ total_questions: totalQuestions }, { where: { id: passage.level_test_id } });
        }
        res.status(200).json({ message: 'Cập nhật bài đọc thành công', passage });
    } catch (error) {
        console.error('Update reading passage error:', error);
        res.status(500).json({ message: 'Lỗi cập nhật bài đọc' });
    }
};

const deletePassage = async (req, res) => {
    try {
        const { id } = req.params;
        const passage = await ReadingPassage.findByPk(id);
        if (!passage) return res.status(404).json({ message: 'Không tìm thấy bài đọc' });
        await passage.destroy();
        res.status(200).json({ message: 'Xóa bài đọc thành công' });
    } catch (error) {
        console.error('Delete reading passage error:', error);
        res.status(500).json({ message: 'Lỗi xóa bài đọc' });
    }
};

const getTestForUser = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await LevelTest.findByPk(id, {
            attributes: ['id', 'book_level', 'title', 'description', 'total_score', 'duration', 'total_questions'],
            include: [
                { model: ReadingPassage, as: 'passages', attributes: ['id', 'title', 'content', 'image_url', 'image_width', 'source'] },
                {
                    model: LevelTestQuestion, as: 'questions',
                    attributes: ['id', 'question_group', 'section', 'content', 'prefix', 'suffix', 'underlined', 'options', 'score', 'order', 'passage_id'],
                    order: [['order', 'ASC']]
                }
            ]
        });
        if (!test) return res.status(404).json({ message: 'Không tìm thấy bài test' });
        res.status(200).json({ message: 'Lấy bài test thành công', test });
    } catch (error) {
        console.error('Get test for user error:', error);
        res.status(500).json({ message: 'Lỗi lấy bài test' });
    }
};

const submitTest = async (req, res) => {
    try {
        const { userId } = req.user;
        const { testId, answers, timeSpent } = req.body;

        if (!testId) return res.status(400).json({ message: 'Thiếu testId' });
        const safeAnswers = Array.isArray(answers) ? answers : [];

        const test = await LevelTest.findByPk(testId);
        if (!test) return res.status(404).json({ message: 'Không tìm thấy bài test' });

        const questions = await LevelTestQuestion.findAll({ where: { level_test_id: testId } });

        let correctCount = 0;
        let totalScore = 0;
        const results = [];

        for (const answer of safeAnswers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) continue;

            let isCorrect = false;
            let correctAnswerContent = question.correct_answer;

            if (question.options && Array.isArray(question.options) && question.options.length > 0) {
                const correctIndex = question.correct_answer.charCodeAt(0) - 65;
                correctAnswerContent = question.options[correctIndex] || question.correct_answer;
                isCorrect = correctAnswerContent === answer.userAnswer;
            } else {
                isCorrect = question.correct_answer === answer.userAnswer;
            }

            if (isCorrect) {
                correctCount++;
                totalScore += question.score;
            }

            results.push({
                questionId: question.id, userAnswer: answer.userAnswer,
                correctAnswer: correctAnswerContent, correctAnswerKey: question.correct_answer,
                isCorrect, explanation: question.explanation, score: isCorrect ? question.score : 0
            });
        }

        const totalQuestions = questions.length;
        const score = (totalScore / test.total_score) * 100;

        const attempt = await LevelTestAttempt.create({
            user_id: userId, level_test_id: testId, score: Math.round(score * 100) / 100,
            correct_count: correctCount, total_questions: totalQuestions, answers: results
        });

        let newCertificate = null;
        
        // Logic chứng nhận mới: >= 85% + Học vượt
        if (score >= 85) {
            newCertificate = await issueCertificate(
                userId,
                'level_test',
                `Chứng nhận Hoàn thành trình độ ${test.book_level}`,
                `Đạt ${Math.round(score)}% bài test trình độ ${test.book_level}`
            );

            const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];
            const currentLevelIndex = levelsOrder.indexOf(test.book_level);

            if (currentLevelIndex > 0) {
                for (let i = 0; i < currentLevelIndex; i++) {
                    const lowerLevel = levelsOrder[i];
                    await issueCertificate(
                        userId,
                        'level_test',
                        `Chứng nhận Hoàn thành trình độ ${lowerLevel}`,
                        `Được công nhận tự động do đã hoàn thành bài test trình độ ${test.book_level}`
                    );
                }
            }
        }

        res.status(200).json({
            message: 'Nộp bài thành công', score: Math.round(score * 100) / 100,
            correctCount, totalQuestions, totalScore, maxScore: test.total_score,
            timeSpent: timeSpent || 0, newCertificate, results, attemptId: attempt.id
        });
    } catch (error) {
        console.error('Submit level test error:', error);
        res.status(500).json({ message: 'Lỗi nộp bài' });
    }
};

const getMyAttempts = async (req, res) => {
    try {
        const { userId } = req.user;
        const { testId } = req.query;
        const whereClause = { user_id: userId };
        if (testId) whereClause.level_test_id = testId;
        const attempts = await LevelTestAttempt.findAll({
            where: whereClause,
            include: [{ model: LevelTest, attributes: ['id', 'title', 'book_level'] }],
            order: [['completed_at', 'DESC']]
        });
        res.status(200).json({ message: 'Lấy lịch sử làm bài thành công', count: attempts.length, attempts });
    } catch (error) {
        console.error('Get my attempts error:', error);
        res.status(500).json({ message: 'Lỗi lấy lịch sử làm bài' });
    }
};

const getAttemptById = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const attempt = await LevelTestAttempt.findOne({
            where: { id, user_id: userId },
            include: [{ model: LevelTest, attributes: ['id', 'title', 'book_level', 'total_score'] }]
        });
        if (!attempt) return res.status(404).json({ message: 'Không tìm thấy lần làm bài' });
        res.status(200).json({ message: 'Lấy chi tiết lần làm bài thành công', attempt });
    } catch (error) {
        console.error('Get attempt by id error:', error);
        res.status(500).json({ message: 'Lỗi lấy chi tiết lần làm bài' });
    }
};

module.exports = {
    getAllLevelTests, getLevelTestById, createLevelTest, updateLevelTest, deleteLevelTest,
    getQuestionsByTest, createQuestion, updateQuestion, deleteQuestion,
    createPassage, updatePassage, deletePassage,
    getTestForUser, submitTest, getMyAttempts, getAttemptById
};