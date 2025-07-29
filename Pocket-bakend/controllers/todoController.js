const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Todo = require("../model/Todo");

exports.handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

// ✅ Get Task Statistics
exports.getStats = async (req, res) => {
    const { userId } = req.params;
    try {
        const total = await Todo.count({ where: { userId } });
        const completed = await Todo.count({ where: { userId, status: true } });
        const pending = await Todo.count({ where: { userId, status: false } });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const today = await Todo.count({
            where: {
                userId,
                createdAt: { [Op.between]: [startOfDay, endOfDay] },
            },
        });

        res.json({ total, completed, pending, today });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
};

// ✅ Get All Tasks for a User
exports.getAllTasks = async (req, res) => {
    const { userId } = req.params;
    try {
        const todos = await Todo.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch todos", error: err.message });
    }
};

// ✅ Create New Task with Manual createdAt
exports.createTask = async (req, res) => {
    const { title, description = "", userId } = req.body;
    try {
        const createdAt = new Date(); 
        const todo = await Todo.create({ title, description, userId, createdAt });
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: "Failed to create todo", error: err.message });
    }
};

// ✅ Toggle Task Status + Set completedAt
exports.toggleTask = async (req, res) => {
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
};

// ✅ Update Task Details 
exports.updateTask = async (req, res) => {
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
};

// ✅ Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const deleted = await Todo.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete task", error: err.message });
    }
};
