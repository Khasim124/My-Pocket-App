const jwt = require("jsonwebtoken");
const { User_details, sequelize } = require("../model/User_details");

const JWT_SECRET = "my_hardcoded_jwt_secret";

module.exports = {
    async register(req, res) {
        const t = await sequelize.transaction();
        try {
            const { user_name, user_email, user_password } = req.body;

            if (!user_name || !user_email || !user_password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const exists = await User_details.findOne({ where: { user_email: user_email.toLowerCase() } });
            if (exists) return res.status(400).json({ error: "Email already in use" });

            const user = await User_details.create({
                user_name,
                user_email: user_email.toLowerCase(),
                user_password
            }, { transaction: t });

            await t.commit();
            res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            await t.rollback();
            const messages = error.errors?.map((e) => e.message) || [error.message];
            res.status(400).json({ errors: messages });
        }
    },

    login(req, res) {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Authentication failed" });

        const payload = {
            id: user.id,
            user_email: user.user_email,
            user_name: user.user_name
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: payload
        });
    },

    async getProfile(req, res) {
        try {
            res.status(200).json(req.user);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch profile" });
        }
    },

    async resetPassword(req, res) {
        const { email, newPassword } = req.body;

        try {
            if (!email || !newPassword) {
                return res.status(400).json({ message: "Email and new password are required" });
            }

            const user = await User_details.findOne({ where: { user_email: email.toLowerCase() } });
            if (!user) return res.status(404).json({ message: "User not found" });

            user.set('user_password', newPassword);
            await user.save();

            res.status(200).json({ message: "Password reset successfully" });
        } catch (err) {
            res.status(500).json({ message: "Server error during password reset" });
        }
    }
};
