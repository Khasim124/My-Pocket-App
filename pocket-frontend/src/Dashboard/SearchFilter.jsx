import { InputGroup, Form, DropdownButton, Dropdown } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

export default function SearchFilter({ filter, setFilter, search, setSearch }) {

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const filters = ["all", "completed", "incomplete", "today"];
  const capitalizedFilter = capitalize(filter);

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text aria-label="Search icon">
        <BsSearch />
      </InputGroup.Text>
      <Form.Control
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search tasks"
      />
      <DropdownButton
        title={`Filter: ${capitalizedFilter}`}
        onSelect={(val) => setFilter(val.toLowerCase())}
        variant="primary"
        align="end"
        id="filter-dropdown"
      >
        {filters.map((f) => (
          <Dropdown.Item key={f} eventKey={f}>
            {f === filter ? "✅ " : ""}
            {capitalize(f)}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </InputGroup>
  );
}
