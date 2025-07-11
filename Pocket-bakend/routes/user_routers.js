const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const controller = require("../controllers/control");
const { User_details } = require("../model/User_details");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "Too many login attempts, try again later"
});

const validateUserDetails = [
    body("user_name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3, max: 150 }).withMessage("Name must be between 3 and 150 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only letters"),

    body("user_email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/).withMessage("Only Gmail addresses are allowed")
        .customSanitizer(email => email.toLowerCase()),

    body("user_password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/).withMessage("Must contain lowercase letter")
        .matches(/[A-Z]/).withMessage("Must contain uppercase letter")
        .matches(/[0-9]/).withMessage("Must contain number")
        .matches(/[@$!%*?&]/).withMessage("Must contain special character")
];

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.post("/register", validateUserDetails, handleValidation, controller.register);
router.post("/login", loginLimiter, passport.authenticate("local", { session: false }), controller.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), controller.getProfile);
router.post("/reset-password", controller.resetPassword);

router.post("/check-email", async (req, res) => {
    const { user_email } = req.body;
    if (!user_email) return res.status(400).json({ message: "Email is required" });

    const user = await User_details.findOne({ where: { user_email: user_email.toLowerCase() } });
    if (!user) return res.status(404).json({ message: "Email not registered!" });

    return res.json({ message: "Email exists", userId: user.id });
});

module.exports = router;
