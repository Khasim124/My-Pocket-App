const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User_details = require("./User_details");

const Todo = sequelize.define(
    "Todo",
    {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User_details,
                key: "id",
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true, 
        },
    },
    {
        timestamps: false, 
        freezeTableName: true,
        tableName: "Todo",
    }
);

Todo.belongsTo(User_details, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
});

module.exports = Todo;
