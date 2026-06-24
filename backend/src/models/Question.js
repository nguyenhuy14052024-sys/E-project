const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    unit_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'units',
            key: 'id'
        }
    },
    question_type: {
    type: DataTypes.ENUM(
        'multiple_choice',
        'gap_filling',
        'word_formation',
        'sentence_transformation',
        'error_correction',
        'collocation'
    ),
    allowNull: false
},
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    options: {
    type: DataTypes.JSON,
    allowNull: true
},
difficulty: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
        min: 1,
        max: 5
    }
},
    correct_answer: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    explanation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    timestamps: true,
    tableName: 'questions'
});

module.exports = Question;