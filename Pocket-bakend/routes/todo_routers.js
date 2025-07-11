const express = require("express");
const { body, validationResult } = require("express-validator");
const Todo = require("../model/Todo");

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get("/stats/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const total = await Todo.count({ where: { userId } });
        const completed = await Todo.count({ where: { userId, status: true } });
        const pending = await Todo.count({ where: { userId, status: false } });
        res.json({ total, completed, pending });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const todos = await Todo.findAll({ where: { userId } });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch todos", error: err.message });
    }
});

router.post(
    "/",
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("userId").isInt({ min: 1 }).withMessage("Valid userId is required"),
    ],
    handleValidation,
    async (req, res) => {
        const { title, description = "", userId } = req.body;
        try {
            const todo = await Todo.create({ title, description, userId });
            res.status(201).json(todo);
        } catch (err) {
            res.status(500).json({ message: "Failed to create todo", error: err.message });
        }
    }
);

router.put("/:id/toggle", async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        if (!todo.status) {
            todo.status = true;
            todo.completedAt = new Date();
        } else {
            return res.status(400).json({ message: "Task already completed. Cannot revert." });
        }

        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: "Failed to toggle task", error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { title, description = "" } = req.body;
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.title = title;
        todo.description = description;
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: "Failed to update task", error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Todo.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete task", error: err.message });
    }
});

module.exports = router;
