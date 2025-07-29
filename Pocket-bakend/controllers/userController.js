require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const User_details = require("../model/User_details");
const sequelize = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = {
    //  Register User
    async register(req, res) {
        const t = await sequelize.transaction();
        try {
            let { user_name, user_email, user_password } = req.body;

            if (!user_name?.trim() || !user_email?.trim() || !user_password?.trim()) {
                return res.status(400).json({ error: "All fields are required" });
            }

            user_email = user_email.toLowerCase();

            const existingUser = await User_details.findOne({ where: { user_email } });
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use" });
            }

            //  Hash the password
            const hashedPassword = await bcrypt.hash(user_password, 10);

            const user = await User_details.create({
                user_name: user_name.trim(),
                user_email,
                user_password, // 
            }, { transaction: t });


            await t.commit();

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    user_name: user.user_name,
                    user_email: user.user_email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        } catch (error) {
            await t.rollback();
            const messages = error?.errors?.map((e) => e.message) || [error.message];
            res.status(400).json({ errors: messages });
        }
    },

    //  Login User
    login(req, res) {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const payload = {
            id: user.id,
            user_email: user.user_email,
            user_name: user.user_name,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: payload,
        });
    },

    //  Get User Profile
    async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({
                id: req.user.id,
                user_name: req.user.user_name,
                user_email: req.user.user_email,
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch profile" });
        }
    },

    //  Reset Password
    async resetPassword(req, res) {
        try {
            const { user_email, user_password } = req.body;

            if (!user_email?.trim() || !user_password?.trim()) {
                return res.status(400).json({ message: "Email and new password are required" });
            }

            const normalizedEmail = user_email.toLowerCase();
            const user = await User_details.findOne({ where: { user_email: normalizedEmail } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            //  Hash new password
            const hashedPassword = await bcrypt.hash(user_password, 10);
            user.user_password = hashedPassword;

            await user.save();

            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error during password reset", error: error.message });
        }
    }
}
