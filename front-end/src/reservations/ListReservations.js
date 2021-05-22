import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "./ReservationDisplay";

export default function ListReservations({ reservations, reservationsError }) {
  return (
    <>
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
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        <tbody>
          <ReservationDisplay reservations={reservations} />
        </tbody>
      </table>
    </>
  );
}
