import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPasswordThunk } from "../features/auth/authThunks";

const resetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Minimum 8 characters")
    .matches(/[a-z]/, "Must include lowercase")
    .matches(/[A-Z]/, "Must include uppercase")
    .matches(/[0-9]/, "Must include number")
    .matches(/[@$!%*?&#]/, "Must include special character"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      setServerError("Email not found. Please restart password reset.");
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    }
  }, [email, navigate]);

  const handleReset = async (values, { setSubmitting }) => {
    setServerError("");
    if (!email || !values.newPassword) {
      setServerError("Email and new password are required.");
      setSubmitting(false);
      return;
    }

    try {
      await dispatch(
        resetPasswordThunk({
          email,
          newPassword: values.newPassword.trim(),
        })
      ).unwrap();

      alert("Password reset successful!");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err) {
      setServerError(err?.message || "Reset failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={resetSchema}
          onSubmit={handleReset}
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
            <Form onSubmit={handleSubmit} noValidate>
              {/* New Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.newPassword && !!errors.newPassword}
                    style={{ paddingRight: "40px" }}
                    autoComplete="new-password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
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
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Confirm Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.confirmPassword && !!errors.confirmPassword
                    }
                    style={{ paddingRight: "40px" }}
                    autoComplete="new-password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
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
                    {errors.confirmPassword}
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
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
