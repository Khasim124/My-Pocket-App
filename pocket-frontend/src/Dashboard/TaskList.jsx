import { Col, Row } from "react-bootstrap";
import TaskCard from "./TaskCard";

export default function TaskList({
  tasks,
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
  if (!Array.isArray(tasks)) return null;

  return (
    <Row>
      {tasks.length === 0 ? (
        <p className="text-center text-muted mt-4">No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <Col md={6} lg={4} className="mb-4" key={task.id}>
            <TaskCard
              task={task}
              isToday={isToday}
              editingTaskId={editingTaskId}
              editedTitle={editedTitle}
              editedDesc={editedDesc}
              onEditClick={onEditClick}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              setEditedTitle={setEditedTitle}
              setEditedDesc={setEditedDesc}
            />
          </Col>
        ))
      )}
    </Row>
  );
}
