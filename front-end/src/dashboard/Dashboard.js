import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import ReservationDisplay from "../reservations/ReservationDisplay";
import TablesDisplay from "../tables/TablesDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
}) {
  const history = useHistory();

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Seat Table</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          <ReservationDisplay reservations={reservations} />
        </tbody>
      </table>

      <h4>Tables</h4>

      <ErrorAlert error={tablesError} />

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <TablesDisplay tables={tables} />
        </tbody>
      </table>

      <button
        className="btn btn-secondary mx-1"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        className="btn btn-primary mx-1"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        className="btn btn-secondary mx-1"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
    </main>
  );
}

export default Dashboard;
