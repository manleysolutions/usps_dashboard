import React from "react";

const DataTable = ({ data = [], columns = [] }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Export both default and named for compatibility
export default DataTable;
export { DataTable };
