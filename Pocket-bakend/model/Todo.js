const { DataTypes } = require('sequelize');
const { sequelize, User_details } = require('./User_details');

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    freezeTableName: true,
});

Todo.belongsTo(User_details, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});

module.exports = Todo;
