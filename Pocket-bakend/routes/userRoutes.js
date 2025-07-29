require("dotenv").config();
const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/userController");
const User_details = require("../model/User_details");

const router = express.Router();

//  Rate limiting login attempts
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 10,
    message: {
        message: "Too many login attempts, please try again later",
    },
});

//  Registration validation
const validateUserDetails = [
    body("user_name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3, max: 150 }).withMessage("Name must be between 3 and 150 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only letters and spaces"),

    body("user_email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/).withMessage("Only Gmail addresses are allowed")
        .customSanitizer(email => email.toLowerCase()),

    body("user_password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
        .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain a number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain a special character"),
];

//  Reset password validation
const validateResetPassword = [
    body("user_email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .customSanitizer(email => email.toLowerCase()),

    body("user_password")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
        .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain a number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain a special character"),
];

//  Validation error handler
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

//  Auth middleware (JWT protected)
const requireAuth = passport.authenticate("jwt", { session: false });

// Register
router.post("/register", validateUserDetails, handleValidation, controller.register);

// Login
router.post(
    "/login",
    loginLimiter,
    passport.authenticate("local", { session: false }),
    controller.login
);

// Get Profile (Protected)
router.get("/profile", requireAuth, controller.getProfile);

// Reset Password
router.post("/reset-password", validateResetPassword, handleValidation, controller.resetPassword);

// Check if Email Exists
router.post("/check-email", async (req, res) => {
    try {
        const { user_email } = req.body;
        if (!user_email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const email = user_email.toLowerCase();
        const user = await User_details.findOne({ where: { user_email: email } });

        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        return res.status(200).json({
            message: "Email exists",
            userId: user.id,
            user_email: user.user_email,
        });
    } catch (error) {
        console.error("❌ check-email error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Verify Token
router.get("/verify-token", requireAuth, (req, res) => {
    return res.status(200).json({ message: "Token is valid", user: req.user });
});

// Logout (client should delete token)
router.post("/logout", (req, res) => {
    return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;