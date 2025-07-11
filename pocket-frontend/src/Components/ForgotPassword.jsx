import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState } from "react";

const emailSchema = Yup.object().shape({
  user_email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Only Gmail addresses are allowed"
    ),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  return (
    <div className="p-4" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center mb-4">Forgot Password</h2>
      <Formik
        initialValues={{ user_email: "" }}
        validationSchema={emailSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setServerError("");
            const res = await axios.post(
              "http://localhost:3000/userdetails/check-email",
              values
            );
            if (res.data?.userId) {
              localStorage.setItem("resetEmail", values.user_email);
              navigate("/verify-code");
            }
          } catch (error) {
            setServerError(
              error.response?.data?.message || "Something went wrong"
            );
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
            <Form.Group className="mb-3">
              <Form.Label>Gmail Address</Form.Label>
              <Form.Control
                type="email"
                name="user_email"
                placeholder="Enter Gmail address"
                autoComplete="off"
                value={values.user_email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.user_email && !!errors.user_email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.user_email}
              </Form.Control.Feedback>
              {serverError && (
                <div className="text-danger mt-1">{serverError}</div>
              )}
            </Form.Group>
            <Button type="submit" disabled={isSubmitting} className="w-100">
              {isSubmitting ? "Processing..." : "Next"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
