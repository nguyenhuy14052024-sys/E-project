const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const LevelTest = sequelize.define('LevelTest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    book_level: {
        type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
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
    total_score: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 60
    },
    total_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
    tableName: 'level_tests'
});

module.exports = LevelTest;