import React from "react";
import { useCustomerData } from "./hooks/useCustomerData.js";
import { CustomerTable } from "./components/CustomerTable.jsx";
import { FilterButton } from "./components/FilterButton.jsx";
import "./index.css";

function App() {
  const {
    displayedList,
    isInitializing,
    isProcessing,
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
  } = useCustomerData();

  const customerCount = isInitializing ? "..." : displayedList.length;

  return (
    <div className="app-container">
      <header className="app-header">
        <img
          src="/DoubleTick Logo.png"
          alt="DoubleTick Logo"
          className="logo"
        />
      </header>

      <main>
        <div className="title-bar">
          <h2>All Customers</h2>
          <span className="customer-count">{customerCount}</span>
        </div>

        <div className="controls-container">
          <div className="search-wrapper">
            <img
              src="/test_Search-3.svg"
              alt="Search"
              className="search-icon"
            />
            <input
              type="text"
              placeholder="Search Customers"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterButton />
        </div>

        {isInitializing ? (
          <div className="loader">Generating 1,000,000 records...</div>
        ) : (
          <>
            {isProcessing && (
              <div className="loader processing">Processing...</div>
            )}
            <CustomerTable
              customers={displayedList}
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
