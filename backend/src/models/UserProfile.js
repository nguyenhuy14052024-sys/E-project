const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UserProfile = sequelize.define('UserProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    goals: {
        type: DataTypes.JSON, // Mảng các mục tiêu, VD: ["Du lịch", "Công việc"]
        allowNull: true
    },
    current_level: {
        type: DataTypes.STRING, // "Mới bắt đầu", "Đã biết chút ít", "Đang ôn luyện"
        allowNull: true
    },
    pain_points: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    specific_goals: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    referral_source: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_onboarded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'user_profiles'
});

module.exports = UserProfile;