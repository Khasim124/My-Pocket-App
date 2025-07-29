import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ForgotPassword from "./Components/ForgotPassword";
import VerifyCode from "./Components/VerifyCode";
import ResetPassword from "./Components/ResetPassword";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Dashboard from "./Dashboard/Dashboard";
import "./App.css"
import { getProfile } from "./features/auth/authThunks";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, user, token]);

  const RequireAuth = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    if (!isAuthenticated) {
      return <div className="text-center mt-5">Loading user...</div>;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <Container className="text-center mt-5">
              <h2>🚫 404 - Page Not Found</h2>
            </Container>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
