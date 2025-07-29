import { createSlice } from "@reduxjs/toolkit";
import {
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    fetchTaskStats,
} from "./taskThunks";

const initialState = {
    tasks: [],
    stats: { total: 0, completed: 0, pending: 0, today: 0 },
    loading: false,
    error: null,
    searchQuery: "",
    filterStatus: "all",
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
                state.loading = false;
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) state.tasks[index] = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(toggleTaskStatus.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) state.tasks[index] = action.payload;
            })
            .addCase(fetchTaskStats.fulfilled, (state, action) => {
                state.stats = {
                    total: action.payload.total || 0,
                    completed: action.payload.completed || 0,
                    pending: action.payload.pending || 0,
                    today: action.payload.today || 0,
                };
            });
    },
});

export const { setSearchQuery, setFilterStatus } = taskSlice.actions;
export default taskSlice.reducer;
