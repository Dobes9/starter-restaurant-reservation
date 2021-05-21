import React from "react";

export default function TablesDisplay({ tables }) {
  const allTables = tables.map((table) => {
    const { table_id, table_name, capacity, status } = table;

    const clickHandler = (event) => {
      event.preventDefault();
      // API call to go here
    };

    return (
      <tr key={table_id}>
        <td>{table_id}</td>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td data-table-id-status={table_id}>{status}</td>
        <td>
          {status === "occupied" ? (
            <button
              className="btn btn-primary"
              type="button"
              data-table-id-finish={table_id}
              onClick={() => {
                const confirmation = window.confirm(
                  `Is this table ready to seat new guests? This cannot be undone.`
                );
                if (confirmation) {
                  clickHandler();
                }
              }}
            >
              Finish
            </button>
          ) : null}
        </td>
      </tr>
    );
  });

  return <>{allTables}</>;
}
