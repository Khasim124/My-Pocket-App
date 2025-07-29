// src/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Toast, ToastContainer } from "react-bootstrap";

import StatsSection from "./StatsSection";
import SearchFilter from "./SearchFilter";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";

import {
  fetchTasks,
  fetchTaskStats,
  addTask,
  toggleTaskStatus,
  deleteTask,
  updateTask,
} from "../features/tasks/taskThunks";

import { setFilterStatus, setSearchQuery } from "../features/tasks/taskSlice";
import { logout } from "../features/auth/authSlice";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { tasks, stats, loading, error, filterStatus, searchQuery } =
    useSelector((state) => state.tasks);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [addTitleError, setAddTitleError] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks());
      dispatch(fetchTaskStats());
    } else {
      navigate("/login");
    }
  }, [user?.id, dispatch, navigate]);

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filteredTasks = tasks.filter((task) => {
    let matchesFilter = true;
    switch (filterStatus.toLowerCase()) {
      case "completed":
        matchesFilter = task.status === true;
        break;
      case "incomplete":
      case "pending":
        matchesFilter = task.status === false;
        break;
      case "today":
        matchesFilter = isToday(task.createdAt);
        break;
      default:
        matchesFilter = true;
    }

    const matchesSearch = (task.title ?? "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const showSuccessToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setAddTitleError("Title is required");
      return;
    }

    try {
      await dispatch(
        addTask({
          title: newTaskTitle,
          description: newTaskDesc,
        })
      ).unwrap();

      setNewTaskTitle("");
      setNewTaskDesc("");
      setAddTitleError("");
      setShowAddModal(false);
      dispatch(fetchTaskStats());
      dispatch(fetchTasks());
      showSuccessToast("✅ Task added successfully");
    } catch {
      alert("❌ Failed to add task");
    }
  };

  const toggleTask = async (id, currentStatus) => {
    if (currentStatus) {
      alert("This task is already marked as completed and cannot be undone.");
      return;
    }

    if (!window.confirm("Mark this task as completed?")) return;

    try {
      await dispatch(toggleTaskStatus(id)).unwrap();
      dispatch(fetchTaskStats());
      dispatch(fetchTasks());
      showSuccessToast("✅ Task marked as completed");
    } catch {
      alert("❌ Failed to update task status");
    }
  };

  const deleteTaskHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(fetchTaskStats());
      dispatch(fetchTasks());
      showSuccessToast("🗑️ Task deleted successfully");
    } catch {
      alert("❌ Failed to delete task");
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDesc(task.description);
  };

  const handleSaveEdit = async (id) => {
    try {
      await dispatch(
        updateTask({
          id,
          updates: { title: editedTitle, description: editedDesc },
        })
      ).unwrap();
      setEditingTaskId(null);
      dispatch(fetchTasks());
      dispatch(fetchTaskStats());
      showSuccessToast("✏️ Task updated successfully");
    } catch {
      alert("❌ Failed to update task");
    }
  };

  const onFilterChange = (filter) => {
    dispatch(setFilterStatus(filter.toLowerCase()));
  };

  const onSearchChange = (search) => {
    dispatch(setSearchQuery(search));
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-wrapper min-vh-100 py-4">
      {/* Toast message */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white fw-semibold">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <h4 className="text-primary m-0">📄 My Pocket App</h4>
        <div className="d-flex align-items-center">
          <span
            className="me-2"
            style={{
              fontWeight: "bold",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: "#e8a317",
              fontSize: "1.2rem",
              textShadow: "1px 1px 2px #b47f09",
            }}
          >
            👤 {user?.user_name || user?.user_email?.split("@")[0] || "User"}
          </span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Task Header */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h5 className="m-0">
          📄 Your Tasks{" "}
          <small className="text-muted">({filteredTasks.length} shown)</small>
        </h5>
        <Button
          variant="dark"
          className="px-3 fw-semibold"
          onClick={() => setShowAddModal(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        filter={filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
        setFilter={onFilterChange}
        search={searchQuery}
        setSearch={onSearchChange}
      />

      {/* Task List */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <TaskList
        tasks={filteredTasks}
        isToday={isToday}
        editingTaskId={editingTaskId}
        editedTitle={editedTitle}
        editedDesc={editedDesc}
        onEditClick={handleEditClick}
        onSaveEdit={handleSaveEdit}
        onDelete={deleteTaskHandler}
        onToggle={toggleTask}
        setEditedTitle={setEditedTitle}
        setEditedDesc={setEditedDesc}
        todayBadgeColor="warning"
      />

      {/* Add Task Modal */}
      <AddTaskModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskDesc={newTaskDesc}
        setNewTaskDesc={setNewTaskDesc}
        addTitleError={addTitleError}
        setAddTitleError={setAddTitleError}
        handleAddTask={handleAddTask}
      />
    </div>
  );
}
