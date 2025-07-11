import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./Components/ForgotPassword";
import VerifyCode from "./Components/VerifyCode";
import ResetPassword from "./Components/ResetPassword";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Dashboard from "./Dashboard/Dashboard"; 
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="*"
          element={<h2 className="text-center mt-5">404 - Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
