const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize("mysql://root:Khasim123@localhost:3306/narasimha");

const User_details = sequelize.define("User_details", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Invalid email' }
        }
    },
    user_password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true,
    hooks: {
        beforeCreate: async (user) => {
            user.user_email = user.user_email.toLowerCase();
            const salt = await bcrypt.genSalt(10);
            user.user_password = await bcrypt.hash(user.user_password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('user_password')) {
                const isHashed = user.user_password.startsWith('$2b$');
                if (!isHashed) {
                    const salt = await bcrypt.genSalt(10);
                    user.user_password = await bcrypt.hash(user.user_password, salt);
                }
            }
        }
    }
});

module.exports = { sequelize, User_details };
