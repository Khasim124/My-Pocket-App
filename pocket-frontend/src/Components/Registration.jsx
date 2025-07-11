import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { PostPageList } from "../Services/Server";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  user_name: Yup.string()
    .required("Username is required")
    .min(3, "Must be at least 3 characters")
    .max(150, "Cannot exceed 150 characters")
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),

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

export default function Registration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="login-container p-4"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h2 className="text-center mb-4">Signup</h2>

      <Formik
        initialValues={{
          user_name: "",
          user_email: "",
          user_password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await PostPageList(values);
          if (!(response?.errors || response?.error)) {
            navigate("/login");
          } else {
            console.error("Signup failed", response.error || response.errors);
          }
          setSubmitting(false);
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
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                autoComplete="off"
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

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="user_email"
                autoComplete="off"
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

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="user_password"
                autoComplete="off"
                placeholder="Enter your password"
                value={values.user_password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.user_password && !!errors.user_password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.user_password}
              </Form.Control.Feedback>

              <Form.Check
                type="checkbox"
                label="Show Password"
                className="mt-2"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              disabled={isSubmitting}
              className="w-100"
            >
              {isSubmitting ? "Signing up..." : "Signup"}
            </Button>

            <div className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
