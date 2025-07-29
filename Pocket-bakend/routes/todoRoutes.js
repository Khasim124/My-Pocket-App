const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const todoController = require("../controllers/todoController");

//  Stats route
router.get("/stats/:userId", todoController.getStats);

//  Get all tasks for a user
router.get("/:userId", todoController.getAllTasks);

//  Create new task
router.post(
    "/",
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("userId").isInt({ min: 1 }).withMessage("Valid userId is required"),
    ],
    todoController.handleValidation,
    todoController.createTask
);

//  Toggle status
router.put("/:id/toggle", todoController.toggleTask);

//  Update task
router.put("/:id", todoController.updateTask);

//  Delete task
router.delete("/:id", todoController.deleteTask);

module.exports = router;
