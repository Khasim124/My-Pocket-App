import React from "react";
import { Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";

export default function Header({ user, onLogout }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <h4 className="text-primary m-0">
        <span role="img" aria-label="icon">
          📄
        </span>{" "}
        My Pocket App
      </h4>

      <div className="d-flex align-items-center">
        <FaUser className="me-2" />
        <div className="me-3">
          <span className="fw-semibold">👋 Hello, </span>
          <span>
            {user?.user_name || user?.user_email?.split("@")[0] || "Guest"}
          </span>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={onLogout}
          type="button"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
