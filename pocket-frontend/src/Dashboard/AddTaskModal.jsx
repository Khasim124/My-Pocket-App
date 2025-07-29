import React, { useEffect, useRef } from "react";
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
  const titleInputRef = useRef(null);

  const handleEntered = () => {
    titleInputRef.current?.focus();
  };

  useEffect(() => {
    if (!show) {
      setNewTaskTitle("");
      setNewTaskDesc("");
      setAddTitleError("");
    }
  }, [show, setNewTaskTitle, setNewTaskDesc, setAddTitleError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setAddTitleError("Title is required");
      return;
    }
    setAddTitleError("");
    handleAddTask();
  };

  return (
    <Modal show={show} onHide={onHide} centered onEntered={handleEntered}>
      <Modal.Header closeButton>
        <Modal.Title>📝 Add New Task</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              ref={titleInputRef}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              isInvalid={!!addTitleError}
              placeholder="Enter task title"
              aria-label="Task title"
            />
            <Form.Control.Feedback type="invalid">
              {addTitleError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Enter description (optional)"
              aria-label="Task description"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="dark" type="submit">
            ✅ Add Task
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
