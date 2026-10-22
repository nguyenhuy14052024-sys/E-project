const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true, // Cho phép null nếu khách chưa đăng nhập cũng có thể góp ý
        references: {
            model: 'users',
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    page_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('new', 'read', 'resolved'),
        defaultValue: 'new'
    }
}, {
    timestamps: true,
    tableName: 'feedbacks'
});

module.exports = Feedback;