import React, { memo } from "react";
import * as ReactWindow from "react-window"; // <-- Use namespace import

const formatDate = (isoString) =>
  new Date(isoString).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

const TableHeader = ({ sortConfig, requestSort }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="table-row header sticky-header">
      <div className="cell cell-checkbox">
        <input type="checkbox" />
      </div>
      <div className="cell cell-customer" onClick={() => requestSort("name")}>
        Customer {getSortIcon("name")}
      </div>
      <div className="cell cell-score" onClick={() => requestSort("score")}>
        Score {getSortIcon("score")}
      </div>
      <div className="cell cell-email" onClick={() => requestSort("email")}>
        Email {getSortIcon("email")}
      </div>
      <div
        className="cell cell-last-message"
        onClick={() => requestSort("lastMessageAt")}
      >
        Last message sent at {getSortIcon("lastMessageAt")}
      </div>
      <div
        className="cell cell-added-by"
        onClick={() => requestSort("addedBy")}
      >
        Added by {getSortIcon("addedBy")}
      </div>
    </div>
  );
};

const Row = memo(({ index, style, data }) => {
  const customer = data.list[index];
  if (!customer)
    return (
      <div className="table-row" style={style}>
        Loading...
      </div>
    );

  return (
    <div className="table-row" style={style}>
      <div className="cell cell-checkbox">
        <input type="checkbox" />
      </div>
      <div className="cell cell-customer">
        <img src={customer.avatar} alt="avatar" className="avatar" />
        <div className="customer-details">
          <div className="customer-name">{customer.name}</div>
          <div className="customer-phone">{customer.phone}</div>
        </div>
      </div>
      <div className="cell cell-score">{customer.score}</div>
      <div className="cell cell-email">{customer.email}</div>
      <div className="cell cell-last-message">
        {formatDate(customer.lastMessageAt)}
      </div>
      <div className="cell cell-added-by">
        <img
          src="/test_user-3 3.svg"
          alt="user icon"
          className="added-by-icon"
        />
        {customer.addedBy}
      </div>
    </div>
  );
});

export const CustomerTable = ({ customers, sortConfig, requestSort }) => {
  const ROW_HEIGHT = 65;

  // Remove the dynamic import and state logic
  // const [FixedSizeList, setFixedSizeList] = useState(null);
  // useEffect(() => { ... }, []);

  // Add a check in case the import failed
  if (!ReactWindow || !ReactWindow.FixedSizeList) {
    return <div className="loading">Loading table component...</div>;
  }

  return (
    <div className="table-container">
      <TableHeader sortConfig={sortConfig} requestSort={requestSort} />
      {/* Access FixedSizeList from the imported namespace */}
      <ReactWindow.FixedSizeList
        height={window.innerHeight * 0.8}
        itemCount={customers.length}
        itemSize={ROW_HEIGHT}
        width="100%"
        itemData={{ list: customers }}
      >
        {Row}
      </ReactWindow.FixedSizeList>
    </div>
  );
};
