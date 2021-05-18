import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function SeatReservation({ tables }) {
  const history = useHistory();
  const [tableId, setTableId] = useState(0);
  const [errors, setErrors] = useState([]);

  const tableOptions = tables.map((table) => {
    <option value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>;
  });

  const formChangeHandler = ({ target }) => {
    setTableId(target.value);
  };

  function validateSeat() {}

  const submitHandler = (event) => {
    event.preventDefault();
    // API call to go here
    if (validateSeat()) {
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
            {tableOptions}
          </select>
        </div>
      </div>
      <div>
        <button
          className="btn btn-secondary mx-1"
          onChange={() => history.goBack()}
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
