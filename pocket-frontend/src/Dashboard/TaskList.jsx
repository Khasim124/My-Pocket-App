import { Col, Row } from "react-bootstrap";
import TaskCard from "./TaskCard";
import { FaClipboardList } from "react-icons/fa";

export default function TaskList({
  tasks,
  isToday = () => false,
  editingTaskId,
  editedTitle,
  editedDesc,
  onEditClick,
  onSaveEdit,
  onDelete,
  onToggle,
  setEditedTitle,
  setEditedDesc,
  todayBadgeColor = "primary",  // default blue if not provided
}) {
  if (!Array.isArray(tasks)) return null;

  return (
    <div className="mt-4">
      <Row>
        {tasks.length === 0 ? (
          <Col xs={12} className="text-center text-muted mt-5">
            <FaClipboardList size={48} className="mb-2" />
            <p className="fw-semibold">No tasks found.</p>
          </Col>
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
                todayBadgeColor={todayBadgeColor}  
              />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}
