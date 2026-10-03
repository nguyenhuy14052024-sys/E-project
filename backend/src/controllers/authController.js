const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const { checkStreak } = require('./profileController');
const crypto = require('crypto');
const { sendEmail } = require('../../config/email');
const { Op } = require('sequelize');

// ĐĂNG KÝ
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được đăng ký' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password_hash: hashedPassword
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Cập nhật streak lần đầu
        await checkStreak(user.id);

        res.status(201).json({
            message: 'Đăng ký thành công',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Lỗi đăng ký, vui lòng thử lại' });
    }
};

// ĐĂNG NHẬP
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Cập nhật streak TRƯỚC KHI trả về response
        await checkStreak(user.id);

        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                is_premium: user.is_premium,
                premium_expiry: user.premium_expiry
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi đăng nhập, vui lòng thử lại' });
    }
};

// LẤY PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Lỗi lấy thông tin người dùng' });
    }
};

// QUÊN MẬT KHẨU - Gửi email reset
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }

        // Tạo token reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

        await user.update({
            reset_password_token: resetToken,
            reset_password_expires: resetExpires
        });

        // Gửi email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail(
            email,
            'Đặt lại mật khẩu - EnglishIngLesh',
            `
                <h2>Đặt lại mật khẩu</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Bấm vào link dưới đây:</p>
                <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">Đặt lại mật khẩu</a>
                <p>Link có hiệu lực trong 15 phút.</p>
                <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
            `
        );

        res.status(200).json({
            message: 'Email đặt lại mật khẩu đã được gửi'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Lỗi gửi email' });
    }
};

// ĐẶT LẠI MẬT KHẨU
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_password_expires: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({
            password_hash: hashedPassword,
            reset_password_token: null,
            reset_password_expires: null
        });

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Lỗi đặt lại mật khẩu' });
    }
};

// XÁC THỰC EMAIL
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: { verification_token: token }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ' });
        }

        await user.update({
            is_verified: true,
            verification_token: null
        });

        res.status(200).json({ message: 'Xác thực email thành công' });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: 'Lỗi xác thực email' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    verifyEmail
};