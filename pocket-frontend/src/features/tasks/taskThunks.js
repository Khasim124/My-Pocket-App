import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Services/Server";

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, thunkAPI) => {
        try {
            const userId = thunkAPI.getState().auth.user?.id;
            if (!userId) return thunkAPI.rejectWithValue("User not authenticated");
            const response = await API.get(`/todos/${userId}`);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to fetch tasks");
        }
    }
);

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (taskData, thunkAPI) => {
        try {
            const userId = thunkAPI.getState().auth.user?.id;
            if (!userId) return thunkAPI.rejectWithValue("User not authenticated");
            const response = await API.post("/todos", { ...taskData, userId });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to add task");
        }
    }
);

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, updates }, thunkAPI) => {
        try {
            const response = await API.put(`/todos/${id}`, updates);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to update task");
        }
    }
);

export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id, thunkAPI) => {
        try {
            await API.delete(`/todos/${id}`);
            return id;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to delete task");
        }
    }
);

export const toggleTaskStatus = createAsyncThunk(
    "tasks/toggleTaskStatus",
    async (id, thunkAPI) => {
        try {
            const response = await API.put(`/todos/${id}/toggle`);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to toggle task status");
        }
    }
);

export const fetchTaskStats = createAsyncThunk(
    "tasks/fetchStats",
    async (_, thunkAPI) => {
        try {
            const userId = thunkAPI.getState().auth.user?.id;
            if (!userId) return thunkAPI.rejectWithValue("User not authenticated");
            const response = await API.get(`/todos/stats/${userId}`);
            return {
                total: response.data.total,
                completed: response.data.completed,
                pending: response.data.pending,
                today: response.data.today,
            };
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to fetch stats");
        }
    }
);
