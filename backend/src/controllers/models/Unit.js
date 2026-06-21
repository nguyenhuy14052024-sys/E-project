const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    book_level: {
        type: DataTypes.ENUM('B2', 'C1'),
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
        type: DataTypes.ENUM('grammar', 'vocabulary'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
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