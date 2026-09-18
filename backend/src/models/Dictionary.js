const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Dictionary = sequelize.define('Dictionary', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    definition_en: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    definition_vi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pronunciation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    audio_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    example: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    word_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'dictionary'
});

module.exports = Dictionary;