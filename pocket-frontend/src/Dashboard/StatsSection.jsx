import { Card, Col, Row } from "react-bootstrap";

export default function StatsSection({ stats }) {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center shadow bg-primary text-white">
          <Card.Body className="py-3">
            <Card.Title>Total</Card.Title>
            <h5>{stats.total}</h5>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center shadow bg-success text-white">
          <Card.Body className="py-3">
            <Card.Title>Completed</Card.Title>
            <h5>{stats.completed}</h5>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center shadow bg-danger text-white">
          <Card.Body className="py-3">
            <Card.Title>Incomplete</Card.Title>
            <h5>{stats.pending}</h5>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card
          className="text-center shadow text-white"
          style={{ backgroundColor: "#f1c40f" }}
        >
          <Card.Body className="py-3">
            <Card.Title>Today's Tasks</Card.Title>
            <h5>{stats.today}</h5>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
