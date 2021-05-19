import React from "react";

export default function TablesDisplay({ tables }) {
  const allTables = tables.map((table) => {
    const { table_id, table_name, capacity, status } = table;

    return (
      <tr key={table_id}>
        <td>{table_id}</td>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td data-table-id-status={table_id}>{status}</td>
      </tr>
    );
  });

  return <>{allTables}</>;
}
