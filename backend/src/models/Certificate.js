const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Certificate = sequelize.define('Certificate', {
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
    type: {
        type: DataTypes.ENUM('unit', 'course', 'mini_test', 'streak', 'flashcard', 'error_log'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    unit_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'units',
            key: 'id'
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    earned_at: {
       type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
       allowNull: false
   }
}, {
    timestamps: true,
    tableName: 'certificates'
});

module.exports = Certificate;