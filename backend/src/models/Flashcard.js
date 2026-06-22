const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Flashcard = sequelize.define('Flashcard', {
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
    unit_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'units',
            key: 'id'
        }
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false
    },
    definition: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    example: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    next_review: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ease_factor: {
        type: DataTypes.FLOAT,
        defaultValue: 2.5
    },
    interval: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
    tableName: 'flashcards'
});

module.exports = Flashcard;