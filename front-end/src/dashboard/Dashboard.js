import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}

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
