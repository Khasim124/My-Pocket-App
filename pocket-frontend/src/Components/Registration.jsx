import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authThunks";
import "../App.css"; 

const registerSchema = Yup.object().shape({
  user_name: Yup.string().required("Username is required"),
  user_email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Only Gmail addresses are allowed"
    ),
  user_password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .matches(/[a-z]/, "Must include lowercase")
    .matches(/[A-Z]/, "Must include uppercase")
    .matches(/[0-9]/, "Must include number")
    .matches(/[@$!%*?&#]/, "Must include special character"),
});

export default function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* App name & welcome text */}
        <div className="mb-3 text-start">
          <p className="text-muted mb-1">👋 Welcome to</p>
          <h5 className="text-primary fw-bold m-0">
            <span role="img" aria-label="icon">
              📄
            </span>{" "}
            My Pocket App
          </h5>
        </div>

        <h2 className="mb-4 text-center">Register</h2>

        <Formik
          initialValues={{
            user_name: "",
            user_email: "",
            user_password: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setServerError("");
            try {
              await dispatch(registerUser(values)).unwrap();
              alert("✅ Registered successfully!");
              navigate("/login");
            } catch (error) {
              setServerError(error || "Registration failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {/* Username */}
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  autoFocus
                  type="text"
                  name="user_name"
                  placeholder="Enter your name"
                  value={values.user_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.user_name && !!errors.user_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_name}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="user_email"
                  placeholder="Enter your Gmail"
                  value={values.user_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.user_email && !!errors.user_email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="user_password"
                    placeholder="Enter password"
                    value={values.user_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.user_password && !!errors.user_password}
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    role="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d",
                      zIndex: 10,
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <Form.Control.Feedback type="invalid">
                    {errors.user_password}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {serverError && (
                <div className="text-danger mb-3 text-center">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                variant="success"
                className="w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

              <div className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" style={{ fontWeight: "bold" }}>
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
