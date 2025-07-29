import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const codeSchema = Yup.object().shape({
  code: Yup.string()
    .required("Verification code is required")
    .matches(/^[0-9]{4}$/, "Code must be exactly 4 digits"),
});

export default function VerifyCode() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Enter Verification Code</h2>

        <Formik
          initialValues={{ code: "" }}
          validationSchema={codeSchema}
          onSubmit={(values, { setSubmitting }) => {
            setError("");
            const trimmedCode = values.code.trim();
            if (trimmedCode === "1234") {
              navigate("/reset-password");
            } else {
              setError("Invalid code. Try again.");
            }
            setSubmitting(false);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  placeholder="Enter 4-digit code (1234)"
                  value={values.code}
                  onChange={(e) => {
                    setError("");
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.code && !!errors.code}
                  maxLength={4}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.code}
                </Form.Control.Feedback>
              </Form.Group>

              {error && <div className="text-danger mb-2">{error}</div>}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-100"
              >
                Verify
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
