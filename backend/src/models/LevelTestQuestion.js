const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const LevelTestQuestion = sequelize.define('LevelTestQuestion', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    level_test_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'level_tests', key: 'id' } },
    passage_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'reading_passages', key: 'id' } },
    question_group: {
        type: DataTypes.ENUM(
            'pronunciation', 'word_stress', 'sentence_completion',
            'synonym_antonym', 'communication', 'cloze_test',
            'reading_comprehension', 'true_false', 'error_identification',
            'sentence_transformation', 'sentence_combination'
        ),
        allowNull: false
    },
    // THÊM TRƯỜNG SECTION
    section: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'SECTION A'
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    prefix: { type: DataTypes.TEXT, allowNull: true },
    suffix: { type: DataTypes.TEXT, allowNull: true },
    underlined: { type: DataTypes.TEXT, allowNull: true },
    options: { type: DataTypes.JSON, allowNull: true },
    correct_answer: { type: DataTypes.STRING, allowNull: false },
    explanation: { type: DataTypes.TEXT, allowNull: true },
    score: { type: DataTypes.FLOAT, defaultValue: 1 },
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    timestamps: true,
    tableName: 'level_test_questions'
});

module.exports = LevelTestQuestion;