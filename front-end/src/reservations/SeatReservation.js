import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {
  seatReservation,
  changeReservationStatus,
  readReservation,
} from "../utils/api";

export default function SeatReservation({ tables }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const abortController = new AbortController();

  const [reservation, setReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);
  const [tableId, setTableId] = useState(0);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }, [reservation_id]);

  if (!tables) return null;

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;

  const readableTime = new Date(
    `${reservation_date}T${reservation_time}`
  ).toLocaleTimeString();

  const tableOptions = tables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  const formChangeHandler = ({ target }) => {
    setTableId(Number(target.value));
  };

  function validateSeat() {
    const foundErrors = [];

    const foundTable = tables.find((table) => table.table_id === tableId);

    if (!foundTable) {
      foundErrors.push({ message: `The table you selected does not exist.` });
    } else if (reservationError) {
      foundErrors.push({ message: `The reservation does not exist.` });
    } else {
      if (foundTable.status === "occupied") {
        foundErrors.push({
          message: `The table you selected is currently occupied.`,
        });
      }
      if (foundTable.capacity < reservation.people) {
        foundErrors.push({
          message: `The table you selected cannot seat ${reservation.people} people.`,
        });
      }
    }

    setErrors(foundErrors);

    return foundErrors.length === 0;
  }

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateSeat()) {
      seatReservation(reservation_id, tableId, abortController.signal);
      changeReservationStatus(reservation_id, "seated", abortController.signal);
      history.push("/dashboard").go(0);
    }
  };

  const displayErrors = () => {
    return errors.map((error, index) => {
      return <ErrorAlert key={index} error={error} />;
    });
  };

  return (
    <main>
      <h1>Seat Reservation</h1>
      {reservationError ? (
        <ErrorAlert error={reservationError} />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Time</th>
              <th scope="col">People</th>
            </tr>
          </thead>
          <tbody>
            <tr key={reservation_id}>
              <td>{first_name}</td>
              <td>{last_name}</td>
              <td>{mobile_number}</td>
              <td>{readableTime}</td>
              <td>{people}</td>
            </tr>
          </tbody>
        </table>
      )}
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
              required
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
    </main>
  );
}
