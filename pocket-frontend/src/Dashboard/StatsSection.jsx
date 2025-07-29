import { Card, Col, Row } from "react-bootstrap";
import {
  BsListCheck,
  BsCheckCircle,
  BsClock,
  BsCalendarDay,
} from "react-icons/bs";

export default function StatsSection({ stats }) {
  const { total = 0, completed = 0, pending = 0, today = 0 } = stats || {};

  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card
          className="text-center shadow bg-primary text-white"
          title="Total number of tasks"
        >
          <Card.Body className="py-3">
            <Card.Title>
              <BsListCheck className="me-2" />
              Total
            </Card.Title>
            <h5>{total}</h5>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card
          className="text-center shadow bg-success text-white"
          title="Number of tasks completed"
        >
          <Card.Body className="py-3">
            <Card.Title>
              <BsCheckCircle className="me-2" />
              Completed
            </Card.Title>
            <h5>{completed}</h5>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card
          className="text-center shadow bg-danger text-white"
          title="Number of pending tasks"
        >
          <Card.Body className="py-3">
            <Card.Title>
              <BsClock className="me-2" />
              Incomplete
            </Card.Title>
            <h5>{pending}</h5>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card
          className="text-center shadow text-white"
          style={{ backgroundColor: "#f1c40f" }}
          title="Tasks created today"
        >
          <Card.Body className="py-3">
            <Card.Title>
              <BsCalendarDay className="me-2" />
              Today's Tasks
            </Card.Title>
            <h5>{today}</h5>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
