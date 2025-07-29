const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db"); 

const User_details = sequelize.define(
    "User_details",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: "Invalid email format" },
            },
        },
        user_password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true, 
        hooks: {
            beforeCreate: async (user) => {
                try {
                    user.user_email = user.user_email.toLowerCase();
                    const salt = await bcrypt.genSalt(10);
                    user.user_password = await bcrypt.hash(user.user_password, salt);
                } catch (err) {
                    console.error("Error in beforeCreate hook:", err);
                    throw err;
                }
            },
            beforeUpdate: async (user) => {
                try {
                    if (user.changed("user_password") && !user.user_password.startsWith("$2b$")) {
                        const salt = await bcrypt.genSalt(10);
                        user.user_password = await bcrypt.hash(user.user_password, salt);
                    }
                } catch (err) {
                    console.error("Error in beforeUpdate hook:", err);
                    throw err;
                }
            },
        },
    }
);

module.exports = User_details;
