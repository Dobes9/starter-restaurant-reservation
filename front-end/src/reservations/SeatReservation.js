import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation({ reservations, tables }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tableId, setTableId] = useState(0);
  const [errors, setErrors] = useState([]);

  if (!tables || !reservations) return null;

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
    const foundReservation = reservations.find(
      (reservation) => reservation.reservation_id === reservation_id
    );

    if (!foundTable) {
      foundErrors.push({ message: `The table you selected does not exist.` });
    } else if (!foundReservation) {
      foundErrors.push({ message: `The reservation does not exist.` });
    } else {
      if (foundTable.status === "occupied") {
        foundErrors.push({
          message: `The table you selected is currently occupied.`,
        });
      }
      if (foundTable.capacity < foundReservation.people) {
        foundErrors.push({
          message: `The table you selected cannot seat ${foundReservation.people} people.`,
        });
      }
    }

    setErrors(foundErrors);

    return foundErrors.length === 0;
  }

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateSeat()) {
      // API call to go here
      history.push("/dashboard");
    }
  };

  const displayErrors = () => {
    return errors.map((error, index) => {
      <ErrorAlert key={index} error={error} />;
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <div>{displayErrors()}</div>
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
