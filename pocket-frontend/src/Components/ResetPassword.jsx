import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
  const [showPassword, setShowPassword] = useState(false);
  const email = localStorage.getItem("resetEmail");

  const handleReset = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/userdetails/reset-password",
        {
          email,
          newPassword: values.newPassword,
        }
      );

      if (res.status === 200) {
        alert("Password reset successful!");
        localStorage.removeItem("resetEmail");
        navigate("/login"); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4" style={{ maxWidth: "400px", margin: "auto" }}>
      <h4 className="text-center mb-4">Reset Password</h4>
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
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.newPassword && !!errors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Show Password"
              className="mb-3"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />

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
  );
}
