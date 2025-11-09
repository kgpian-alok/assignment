import React, { useState } from "react";

const FilterButton = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="filter">
      <button onClick={() => setIsOpen(!isOpen)}>{label} ▾</button>
      {isOpen && (
        <div className="filter-dropdown">
          <div>Dummy Option 1</div>
          <div>Dummy Option 2</div>
          <div>Dummy Option 3</div>
        </div>
      )}
    </div>
  );
};

export const Filters = () => (
  <div className="filters-container">
    <FilterButton label="Status" />
    <FilterButton label="Added By" />
    <FilterButton label="Score" />
    <button className="filter-clear">Clear All</button>
  </div>
);
