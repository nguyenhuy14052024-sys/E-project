const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    is_premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    premium_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rank: {
        type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'),
        defaultValue: 'Bronze'
    },
    streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    last_active: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;