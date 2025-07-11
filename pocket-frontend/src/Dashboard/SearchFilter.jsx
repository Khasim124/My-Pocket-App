import { InputGroup, Form, DropdownButton, Dropdown } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

export default function SearchFilter({ filter, setFilter, search, setSearch }) {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>
        <BsSearch />
      </InputGroup.Text>
      <Form.Control
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DropdownButton
        title={filter}
        onSelect={(val) => setFilter(val)}
        variant="primary"
        align="end"
        id="filter-dropdown"
      >
        <Dropdown.Item eventKey="All">All</Dropdown.Item>
        <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
        <Dropdown.Item eventKey="Incomplete">Incomplete</Dropdown.Item>
        <Dropdown.Item eventKey="Today">Today</Dropdown.Item>
      </DropdownButton>
    </InputGroup>
  );
}
