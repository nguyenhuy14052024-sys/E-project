const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    book_level: {
        type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
        allowNull: false
    },
    unit_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('grammar', 'vocabulary', 'mixed'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 3
        }
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    parts: {
        type: DataTypes.JSON,
        allowNull: true
    },
    content_html: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'units'
});

module.exports = Unit;