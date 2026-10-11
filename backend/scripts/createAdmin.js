const bcrypt = require('bcryptjs');
const { User } = require('../src/models');
require('dotenv').config();

const createAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminUsername = process.env.ADMIN_USERNAME;

        if (!adminEmail || !adminPassword || !adminUsername) {
            console.error('Vui lòng set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME trong .env');
            process.exit(1);
        }

        // Kiểm tra admin đã tồn tại chưa
const existingAdmin = await User.findOne({
    where: { username: adminUsername }
});

if (existingAdmin) {
    console.log('Tài khoản admin đã tồn tại:', adminUsername);
    console.log('   Email:', existingAdmin.email);
    console.log('   Role:', existingAdmin.role);
    process.exit(0);
}

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Tạo admin
        await User.create({
            username: adminUsername,
            email: adminEmail,
            password_hash: hashedPassword,
            role: 'admin',
            is_verified: true
        });

        console.log('Đã tạo tài khoản admin:');
        console.log('   Username:', adminUsername);
        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPassword);
        process.exit(0);
    } catch (error) {
        console.error('Lỗi tạo admin:', error);
        process.exit(1);
    }
};

createAdmin();