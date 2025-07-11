import { Button } from "react-bootstrap";

export default function Header({ user, onAddClick, onLogout }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-0">Your Tasks</h2>
        <h5 className="text-muted">Hello, {user?.user_name || "Guest"}</h5>
      </div>
      <div className="d-flex gap-2">
        <Button variant="primary" onClick={onAddClick}>
          Add Task
        </Button>
        <Button variant="outline-danger" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
