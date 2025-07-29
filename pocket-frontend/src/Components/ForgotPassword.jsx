import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../Services/Server";

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
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedEmails = JSON.parse(localStorage.getItem("recentEmails")) || [];
    setEmailSuggestions(savedEmails.slice(0, 4));
  }, []);

  const handleEmailChange = (e, handleChange, setFieldValue) => {
    handleChange(e);
    const inputVal = e.target.value;

    if (inputVal.trim() === "") {
      setShowDropdown(false);
      return;
    }

    const allEmails = JSON.parse(localStorage.getItem("recentEmails")) || [];
    const filtered = allEmails
      .filter((email) => email.toLowerCase().includes(inputVal.toLowerCase()))
      .slice(0, 4);
    setEmailSuggestions(filtered);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (email, setFieldValue) => {
    setFieldValue("user_email", email);
    setShowDropdown(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <Formik
          initialValues={{ user_email: "" }}
          validationSchema={emailSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setServerError("");

              // Save to recent emails
              const existingEmails =
                JSON.parse(localStorage.getItem("recentEmails")) || [];
              const uniqueEmails = [
                values.user_email,
                ...existingEmails.filter((e) => e !== values.user_email),
              ];
              localStorage.setItem(
                "recentEmails",
                JSON.stringify(uniqueEmails)
              );

              const res = await API.post("/userdetails/check-email", {
                user_email: values.user_email,
              });

              if (res.status === 200 && res.data?.user_email) {
                localStorage.setItem("resetEmail", values.user_email);
                navigate("/verify-code");
              } else {
                setServerError("Email not found. Please try again.");
              }
            } catch (error) {
              const status = error.response?.status;

              if (status === 404) {
                setServerError("Email not found. Please try again.");
              } else {
                setServerError("Server error. Please try again.");
              }
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
            setFieldValue,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Gmail Address</Form.Label>
                <Form.Control
                  type="email"
                  name="user_email"
                  autoComplete="off"
                  placeholder="Enter your Gmail"
                  ref={inputRef}
                  value={values.user_email}
                  onChange={(e) =>
                    handleEmailChange(e, handleChange, setFieldValue)
                  }
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  isInvalid={touched.user_email && !!errors.user_email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_email}
                </Form.Control.Feedback>
                {serverError && (
                  <div className="text-danger mt-1">{serverError}</div>
                )}

                {/* Suggestions Dropdown */}
                {showDropdown && emailSuggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 shadow"
                    style={{
                      zIndex: 10,
                      maxHeight: "160px",
                      overflowY: "auto",
                      marginTop: "2px",
                      cursor: "pointer",
                    }}
                  >
                    {emailSuggestions.map((email, idx) => (
                      <li
                        key={idx}
                        className="list-group-item list-group-item-action"
                        onMouseDown={() =>
                          handleSuggestionClick(email, setFieldValue)
                        }
                      >
                        {email}
                      </li>
                    ))}
                  </ul>
                )}
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="w-100"
              >
                {isSubmitting ? "Processing..." : "Next"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
