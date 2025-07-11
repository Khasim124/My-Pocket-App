import { Modal, Button, Form } from "react-bootstrap";

export default function AddTaskModal({
  show,
  onHide,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDesc,
  setNewTaskDesc,
  addTitleError,
  setAddTitleError,
  handleAddTask,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task title"
            value={newTaskTitle}
            onChange={(e) => {
              setNewTaskTitle(e.target.value);
              setAddTitleError("");
            }}
            isInvalid={!!addTitleError}
          />
          <Form.Control.Feedback type="invalid">
            {addTitleError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description (optional)"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddTask}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
