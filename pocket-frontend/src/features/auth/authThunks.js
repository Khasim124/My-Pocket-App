import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Services/Server";


export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {
            const response = await API.post("/userdetails/register", userData);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.errors?.[0] ||
                err.response?.data?.message ||
                "Registration failed"
            );
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, thunkAPI) => {
        try {
            const response = await API.post("/userdetails/login", credentials);
            const { token, user } = response.data;

            localStorage.setItem("token", token); 
            return { token, user };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.errors?.[0] ||
                err.response?.data?.message ||
                "Login failed"
            );
        }
    }
);

export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, thunkAPI) => {
        try {
            const response = await API.get("/userdetails/profile");
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.errors?.[0] ||
                err.response?.data?.message ||
                "Failed to load profile"
            );
        }
    }
);

export const resetPasswordThunk = createAsyncThunk(
    "auth/resetPassword",
    async ({ email, newPassword }, thunkAPI) => {
        try {
            const response = await API.post("/userdetails/reset-password", {
                user_email: email,
                user_password: newPassword,
            });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.errors?.[0] ||
                err.response?.data?.message ||
                "Reset failed"
            );
        }
    }
);
