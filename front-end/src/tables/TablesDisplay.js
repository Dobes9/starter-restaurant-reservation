import React from "react";

export default function TablesDisplay({ tables }) {
  const listTables = tables.map((table) => {
    const { table_id, table_name, capacity } = table;

    return (
      <tr key={table_id}>
        <td>{table_id}</td>
        <td>{table_name}</td>
        <td>{capacity}</td>
      </tr>
    );
  });

  return <>{listTables}</>;
}
