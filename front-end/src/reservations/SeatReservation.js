import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function SeatReservation({ reservations, tables }) {
  const history = useHistory();
  const [tableId, setTableId] = useState(0);
  const [errors, setErrors] = useState([]);

  if (!tables) return null;

  //   if (tables.length === 0) {
  //     return <h4>No Tables to seat reservations</h4>;
  //   }

  const tableOptions = tables.map((table) => {
    return (
      <option value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  const formChangeHandler = ({ target }) => {
    setTableId(target.value);
  };

  function validateSeat() {
    const foundErrors = [];

    const foundTable = tables.find((table) => table.table_id === tableId);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateSeat()) {
      // API call to go here
      history.push("/dashboard");
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="table_id">
            Choose table:
          </label>
          <select
            className="form-control"
            name="table_id"
            id="table_id"
            value={tableId}
            onChange={formChangeHandler}
          >
            <option selected>Please choose a table from this menu</option>
            {tableOptions}
          </select>
        </div>
      </div>
      <div>
        <button
          className="btn btn-secondary mx-1"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button className="btn btn-primary mx-1" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
