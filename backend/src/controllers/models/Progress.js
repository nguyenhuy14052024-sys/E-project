const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Progress = sequelize.define('Progress', {
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
        allowNull: false,
        references: {
            model: 'units',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
        defaultValue: 'not_started'
    },
    score: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    last_accessed: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'progress'
});

module.exports = Progress;