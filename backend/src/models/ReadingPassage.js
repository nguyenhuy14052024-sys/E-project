const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ReadingPassage = sequelize.define('ReadingPassage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    level_test_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'level_tests',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_width: {
        type: DataTypes.STRING,
        defaultValue: '100%'
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'reading_passages'
});

module.exports = ReadingPassage;