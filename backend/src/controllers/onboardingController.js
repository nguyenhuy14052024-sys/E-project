const { UserProfile, User } = require('../models');

// Lưu câu trả lời phỏng vấn
const submitOnboarding = async (req, res) => {
    try {
        const { userId } = req.user;
        const { goals, current_level, pain_points, specific_goals, referral_source } = req.body;

        // Tìm hoặc tạo mới profile (nếu user đã làm rồi thì cập nhật)
        let profile = await UserProfile.findOne({ where: { user_id: userId } });

        if (profile) {
            await profile.update({
                goals, current_level, pain_points, specific_goals, referral_source, is_onboarded: true
            });
        } else {
            profile = await UserProfile.create({
                user_id: userId,
                goals, current_level, pain_points, specific_goals, referral_source, is_onboarded: true
            });
        }

        res.status(200).json({ message: 'Lưu thông tin thành công', profile });
    } catch (error) {
        console.error('Submit onboarding error:', error);
        res.status(500).json({ message: 'Lỗi lưu thông tin' });
    }
};

// Lấy thông tin phỏng vấn (để kiểm tra xem user đã làm chưa)
const getOnboardingStatus = async (req, res) => {
    try {
        const { userId } = req.user;
        const profile = await UserProfile.findOne({ where: { user_id: userId } });
        
        // Nếu chưa có profile hoặc is_onboarded = false thì trả về false
        const isOnboarded = profile ? profile.is_onboarded : false;
        
        res.status(200).json({ is_onboarded: isOnboarded, profile });
    } catch (error) {
        console.error('Get onboarding status error:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin' });
    }
};

module.exports = { submitOnboarding, getOnboardingStatus };