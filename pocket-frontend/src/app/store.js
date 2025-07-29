import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer,
});

const masterReducer = (state, action) => {
    if (action.type === "auth/logout") {
        state = undefined; // reset whole redux state on logout
    }
    return rootReducer(state, action);
};

export const store = configureStore({
    reducer: masterReducer,
});
