// src/components/FilterButton.jsx

import React, { useState } from "react";

export const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filter-wrapper">
      <button className="filter-button" onClick={() => setIsOpen(!isOpen)}>
        <img src="/test_Filter.svg" alt="Filter" />
        Add Filters
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-item">Filter 1</div>
          <div className="filter-item">Filter 2</div>
          <div className="filter-item">Filter 3</div>
          <div className="filter-item">Filter 4</div>
        </div>
      )}
    </div>
  );
};
