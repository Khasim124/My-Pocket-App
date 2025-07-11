import { Card, Button, Form, Badge } from "react-bootstrap";
import { BsCheckCircle, BsTrash, BsPencilSquare, BsSave } from "react-icons/bs";

export default function TaskCard({
  task,
  isToday,
  editingTaskId,
  editedTitle,
  editedDesc,
  onEditClick,
  onSaveEdit,
  onDelete,
  onToggle,
  setEditedTitle,
  setEditedDesc,
}) {
  return (
    <Card
      className={`task-card shadow-sm h-100 ${
        task.status ? "completed" : "pending"
      }`}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingTaskId === task.id ? (
              <Form.Control
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="mb-2"
              />
            ) : (
              <Card.Title
                className="mb-1 text-wrap"
                style={{ fontWeight: "700", fontSize: "1.1rem", color: "#222" }}
              >
                {task.title}
                {isToday(task.createdAt) && (
                  <Badge
                    bg=""
                    style={{
                      backgroundColor: "#f1c40f", 
                      color: "white",
                      marginLeft: "10px",
                    }}
                  >
                    Today
                  </Badge>
                )}
              </Card.Title>
            )}
          </div>

          <div
            className={`badge ${task.status ? "bg-success" : "bg-danger"} ms-2`}
            style={{
              whiteSpace: "nowrap",
              width: "100px",
              textAlign: "center",
              padding: "6px 8px",
              fontSize: "0.75rem",
            }}
          >
            {task.status ? "Completed" : "Incomplete"}
          </div>
        </div>

        <div>
          {editingTaskId === task.id ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              className="mb-2"
            />
          ) : (
            <Card.Text
              className="text-wrap"
              style={{ fontWeight: "500", fontSize: "0.95rem", color: "#555" }}
            >
              {task.description}
            </Card.Text>
          )}

          <div className="task-meta mt-2">
            <div
              className="created"
              style={{ color: "#0d6efd", fontWeight: 500, fontSize: "0.85rem" }}
            >
              Created: {new Date(task.createdAt).toLocaleString()}
            </div>

            {task.status && task.completedAt && (
              <div
                className="completed"
                style={{
                  color: "#28a745",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                Completed: {new Date(task.completedAt).toLocaleString()}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end mt-3 gap-2">
            {!task.status && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => onToggle(task.id, task.status)}
                title="Mark as completed"
              >
                <BsCheckCircle />
              </Button>
            )}
            {editingTaskId === task.id ? (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => onSaveEdit(task.id)}
              >
                <BsSave />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => onEditClick(task)}
              >
                <BsPencilSquare />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => onDelete(task.id)}
            >
              <BsTrash />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
