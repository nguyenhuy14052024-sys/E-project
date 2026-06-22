const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UserAnswer = sequelize.define('UserAnswer', {
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
    question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        }
    },
    user_answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'user_answers'
});

module.exports = UserAnswer;