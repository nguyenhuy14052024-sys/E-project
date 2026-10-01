const { User, Certificate, Progress, Unit, Flashcard, UserAnswer } = require('../models');
const { Op } = require('sequelize');

// ==================== PROFILE ====================

const getProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const totalUnits = await Unit.count();
        const completedUnits = await Progress.count({
            where: { user_id: userId, status: 'completed' }
        });
        const totalFlashcards = await Flashcard.count({
            where: { user_id: userId }
        });
        const totalAnswers = await UserAnswer.count({
            where: { user_id: userId }
        });
        const correctAnswers = await UserAnswer.count({
            where: { user_id: userId, is_correct: true }
        });

        res.status(200).json({
            message: 'Lấy profile thành công',
            user,
            stats: {
                totalUnits,
                completedUnits,
                totalFlashcards,
                totalAnswers,
                correctAnswers,
                accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Lỗi lấy profile' });
    }
};

// ==================== CERTIFICATE ====================

const getCertificates = async (req, res) => {
    try {
        const { userId } = req.user;

        const certificates = await Certificate.findAll({
            where: { user_id: userId },
            order: [['earned_at', 'DESC']],
            include: [
                {
                    model: Unit,
                    attributes: ['id', 'title', 'unit_number', 'book_level']
                }
            ]
        });

        res.status(200).json({
            message: 'Lấy chứng nhận thành công',
            count: certificates.length,
            certificates
        });

    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({ message: 'Lỗi lấy chứng nhận' });
    }
};

const createCertificate = async (req, res) => {
    try {
        const { userId } = req.user;
        const { type, title, description, unitId } = req.body;

        if (!type || !title) {
            return res.status(400).json({ message: 'Thiếu thông tin: type, title' });
        }

        const code = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const certificate = await Certificate.create({
            user_id: userId,
            type,
            title,
            description,
            unit_id: unitId || null,
            code,
            earned_at: new Date()
        });

        res.status(201).json({
            message: 'Tạo chứng nhận thành công',
            certificate
        });

    } catch (error) {
        console.error('Create certificate error:', error);
        res.status(500).json({ message: 'Lỗi tạo chứng nhận' });
    }
};

// ==================== HÀM HỖ TRỢ ====================

const updatePoints = async (userId, pointsToAdd) => {
    const user = await User.findByPk(userId);
    if (!user) return;

    const newPoints = user.points + pointsToAdd;
    let newRank = 'Bronze';

    if (newPoints >= 5000) newRank = 'Master';
    else if (newPoints >= 2000) newRank = 'Diamond';
    else if (newPoints >= 1000) newRank = 'Platinum';
    else if (newPoints >= 500) newRank = 'Gold';
    else if (newPoints >= 100) newRank = 'Silver';

    await user.update({ points: newPoints, rank: newRank });
};

const issueCertificate = async (userId, type, title, description, unitId = null) => {
    const code = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const certificate = await Certificate.create({
        user_id: userId,
        type,
        title,
        description,
        unit_id: unitId,
        code,
        earned_at: new Date()
    });

    return certificate;
};

const checkStreak = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return;

    const now = new Date();
    const lastActive = new Date(user.last_active);
    const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

    let newStreak = user.streak;

    if (diffDays === 1) {
        newStreak += 1;
    } else if (diffDays > 1) {
        newStreak = 1;
    }

    await user.update({ 
        streak: newStreak, 
        last_active: now 
    });

    if (newStreak === 7) {
        await issueCertificate(userId, 'streak', 'Streak 7 ngày', 'Học liên tục 7 ngày');
    } else if (newStreak === 30) {
        await issueCertificate(userId, 'streak', 'Streak 30 ngày', 'Học liên tục 30 ngày');
    } else if (newStreak === 100) {
        await issueCertificate(userId, 'streak', 'Streak 100 ngày', 'Học liên tục 100 ngày');
    }
};

module.exports = {
    getProfile,
    getCertificates,
    createCertificate,
    updatePoints,
    issueCertificate,
    checkStreak
};