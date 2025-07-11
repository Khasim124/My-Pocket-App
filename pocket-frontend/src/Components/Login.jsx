import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState, useRef } from "react";

const loginSchema = Yup.object().shape({
  user_email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Only Gmail addresses are allowed"
    ),
  user_password: Yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsBoxRef = useRef();

  return (
    <div
      className="login-container p-4"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h2 className="text-center mb-4">Login</h2>

      <Formik
        initialValues={{ user_email: "", user_password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormError("");
          try {
            const response = await axios.post(
              "http://localhost:3000/userdetails/login",
              values
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            let emails = JSON.parse(localStorage.getItem("loginEmails")) || [];
            if (!emails.includes(values.user_email)) {
              emails.push(values.user_email);
              localStorage.setItem("loginEmails", JSON.stringify(emails));
            }

            navigate("/dashboard");
          } catch (error) {
            const msg =
              error.response?.data?.message || "Invalid email or password";
            setFormError(msg);
          } finally {
            setSubmitting(false);
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
        }) => {
          const onEmailChange = (e) => {
            const input = e.target.value;
            handleChange(e);
            const savedEmails =
              JSON.parse(localStorage.getItem("loginEmails")) || [];
            if (input.length > 1) {
              const matched = savedEmails.filter((email) =>
                email.toLowerCase().startsWith(input.toLowerCase())
              );
              setSuggestions(matched);
            } else {
              setSuggestions([]);
            }
          };

          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="user_email"
                  autoComplete="off"
                  placeholder="Enter Gmail address"
                  value={values.user_email}
                  onChange={onEmailChange}
                  onBlur={(e) => {
                    setTimeout(() => setSuggestions([]), 200);
                    handleBlur(e);
                  }}
                  isInvalid={touched.user_email && !!errors.user_email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_email}
                </Form.Control.Feedback>

                {suggestions.length > 0 && (
                  <div
                    ref={suggestionsBoxRef}
                    className="position-absolute bg-white border w-100"
                    style={{
                      zIndex: 10,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {suggestions.map((email) => (
                      <div
                        key={email}
                        className="p-2 border-bottom suggestion-item"
                        style={{ cursor: "pointer" }}
                        onMouseDown={() => {
                          setFieldValue("user_email", email);
                          setSuggestions([]);
                        }}
                      >
                        {email}
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="user_password"
                  placeholder="Enter password"
                  value={values.user_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.user_password && !!errors.user_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Check
                type="checkbox"
                label="Show Password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mb-3"
              />

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
                Don’t have an account? <Link to="/">Signup</Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
