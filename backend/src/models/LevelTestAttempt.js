const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const LevelTestAttempt = sequelize.define('LevelTestAttempt', {
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
    level_test_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'level_tests',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    correct_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    answers: {
        type: DataTypes.JSON,
        allowNull: true
    },
    completed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'level_test_attempts'
});

module.exports = LevelTestAttempt;