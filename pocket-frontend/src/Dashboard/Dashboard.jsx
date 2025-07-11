import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import StatsSection from "./StatsSection";
import SearchFilter from "./SearchFilter";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    today: 0,
  });
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [addTitleError, setAddTitleError] = useState("");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  const isToday = (dateStr) => {
    const taskDate = new Date(dateStr);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/todos/${userId}`);
      setTodos(res.data);
    } catch {
      setTodos([]);
    }
  }, [userId]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/todos/${userId}`);
      const all = res.data;
      const completed = all.filter((t) => t.status).length;
      const pending = all.filter((t) => !t.status).length;
      const today = all.filter((t) => isToday(t.createdAt)).length;
      setStats({ total: all.length, completed, pending, today });
    } catch {
      setStats({ total: 0, completed: 0, pending: 0, today: 0 });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTodos();
      fetchStats();
    }
  }, [userId, fetchTodos, fetchStats]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setAddTitleError("Task title is required");
      return;
    }

    try {
      await axios.post("http://localhost:3000/todos", {
        title: newTaskTitle,
        description: newTaskDesc,
        userId,
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      setAddTitleError("");
      setShowAddModal(false);
      fetchTodos();
      fetchStats();
    } catch {
      alert("Failed to add task");
    }
  };

  const toggleTask = async (id, currentStatus) => {
    if (currentStatus) {
      alert("This task is already marked as completed and cannot be undone.");
      return;
    }

    if (!window.confirm("Mark this task as completed?")) return;

    try {
      await axios.put(`http://localhost:3000/todos/${id}/toggle`);
      fetchTodos();
      fetchStats();
    } catch {
      alert("Failed to update task status");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`);
      fetchTodos();
      fetchStats();
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDesc(task.description);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3000/todos/${id}`, {
        title: editedTitle,
        description: editedDesc,
      });
      setEditingTaskId(null);
      fetchTodos();
      fetchStats();
    } catch {
      alert("Failed to update task");
    }
  };

  const filteredTasks = todos.filter((task) => {
    const matchFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? task.status
        : filter === "Today"
        ? isToday(task.createdAt)
        : !task.status;
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="container mt-4">
      <Header
        user={user}
        onAddClick={() => setShowAddModal(true)}
        onLogout={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      />
      <StatsSection stats={stats} />
      <SearchFilter
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />
      <TaskList
        tasks={filteredTasks}
        isToday={isToday}
        editingTaskId={editingTaskId}
        editedTitle={editedTitle}
        editedDesc={editedDesc}
        onEditClick={handleEditClick}
        onSaveEdit={handleSaveEdit}
        onDelete={deleteTask}
        onToggle={toggleTask}
        setEditedTitle={setEditedTitle}
        setEditedDesc={setEditedDesc}
      />
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
