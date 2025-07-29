import { createSlice } from "@reduxjs/toolkit";
import {
    registerUser,
    loginUser,
    getProfile,
    resetPasswordThunk,
} from "./authThunks";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.successMessage = null;
            localStorage.removeItem("token");
        },
        resetUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = "Registration successful";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })

            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getProfile.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
            })

            .addCase(resetPasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(resetPasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Reset failed";
            });
    },
});

export const { logout, resetUser, clearError, clearSuccessMessage } =
    authSlice.actions;

export default authSlice.reducer;
