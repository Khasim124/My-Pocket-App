import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import "../App.css";

// Simple debounce function
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const loginSchema = Yup.object().shape({
  user_email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Only Gmail addresses are allowed"
    ),
  user_password: Yup.string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[a-z]/, "Must include lowercase letter")
    .matches(/[A-Z]/, "Must include uppercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[@$!%*?&#]/, "Must include a special character"),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsBoxRef = useRef();

  const savedEmails = JSON.parse(localStorage.getItem("loginEmails")) || [];

  const getSuggestions = (value) => {
    const input = value.toLowerCase().trim();
    if (input.length > 0) {
      const filtered = savedEmails.filter((email) =>
        email.toLowerCase().startsWith(input)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setActiveIndex(-1);
  };

const debouncedGetSuggestions = useRef(debounce(getSuggestions, 300)).current;


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsBoxRef.current &&
        !suggestionsBoxRef.current.contains(e.target)
      ) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="mb-3 text-start">
          <p className="text-muted mb-1">👋 Welcome to</p>
          <h5 className="text-primary fw-bold m-0">
            <span role="img" aria-label="icon">
              📄
            </span>{" "}
            My Pocket App
          </h5>
        </div>

        <h2 className="mb-4 text-center">Login</h2>

        <Formik
          initialValues={{ user_email: "", user_password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setFormError("");
            try {
              const resultAction = await dispatch(loginUser(values));
              if (loginUser.fulfilled.match(resultAction)) {
                const normalized = values.user_email.trim().toLowerCase();
                if (!savedEmails.includes(normalized)) {
                  const updated = [...savedEmails, normalized];
                  localStorage.setItem("loginEmails", JSON.stringify(updated));
                }
                navigate("/dashboard");
              } else {
                setFormError(
                  resultAction.payload || "Invalid email or password"
                );
              }
            } catch {
              setFormError("Unexpected error during login");
            } finally {
              setSubmitting(false);
              setSuggestions([]);
              setActiveIndex(-1);
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            touched,
            errors,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="user_email"
                  autoComplete="off"
                  placeholder="Enter Gmail address"
                  value={values.user_email}
                  onChange={(e) => {
                    handleChange(e);
                    debouncedGetSuggestions(e.target.value);
                  }}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (suggestions.length) {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveIndex(
                          (prev) => (prev + 1) % suggestions.length
                        );
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveIndex((prev) =>
                          prev <= 0 ? suggestions.length - 1 : prev - 1
                        );
                      } else if (e.key === "Enter" && activeIndex >= 0) {
                        e.preventDefault();
                        setFieldValue("user_email", suggestions[activeIndex]);
                        setSuggestions([]);
                        setActiveIndex(-1);
                      }
                    }
                  }}
                  isInvalid={touched.user_email && !!errors.user_email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_email}
                </Form.Control.Feedback>

                {suggestions.length > 0 && (
                  <div
                    ref={suggestionsBoxRef}
                    className="position-absolute bg-white border w-100 shadow-sm rounded"
                    style={{
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    {suggestions.map((email, index) => (
                      <div
                        key={email}
                        className={`p-2 suggestion-item ${
                          index === activeIndex ? "bg-light fw-bold" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onMouseDown={() => {
                          setFieldValue("user_email", email);
                          setSuggestions([]);
                          setActiveIndex(-1);
                        }}
                      >
                        {email}
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="user_password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
                      right: "10px",
                      top: "50%",
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

              <div className="text-end mb-3">
                <Link to="/forgot-password" style={{ fontSize: "0.9rem" }}>
                  Forgot Password?
                </Link>
              </div>

              {formError && (
                <div className="text-danger mb-3 text-center">{formError}</div>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="w-100"
              >
                {isSubmitting ? "Logging in..." : "Submit"}
              </Button>

              <div className="text-center mt-3">
                Don’t have an account?{" "}
                <Link to="/register" style={{ fontWeight: "bold" }}>
                  Signup
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
