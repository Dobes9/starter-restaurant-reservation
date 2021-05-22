import React from "react";
import { useHistory } from "react-router-dom";
import { changeReservationStatus } from "../utils/api";

export default function ReservationDisplay({ reservations }) {
  const history = useHistory();
  const abortController = new AbortController();
  const listReservations = reservations.map((reservation) => {
    const {
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = reservation;
    const readableTime = new Date(
      `${reservation_date}T${reservation_time}`
    ).toLocaleTimeString();

    return (
      <tr key={reservation_id}>
        <td>{reservation_id}</td>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{readableTime}</td>
        <td>{people}</td>
        <td>{status}</td>
        <td>
          {status === "booked" ? (
            <a href={`/reservations/${reservation_id}/seat`}>
              <button className="btn btn-primary" type="button">
                Seat
              </button>
            </a>
          ) : null}
        </td>
        <td>
          <a href={`/reservations/${reservation_id}/edit`}>
            <button className="btn btn-primary" type="button">
              Edit
            </button>
          </a>
        </td>
        <td>
          <button
            className="btn btn-danger"
            type="button"
            data-reservation-id-cancel={reservation_id}
            onClick={() => {
              const confirmation = window.confirm(
                `Do you want to cancel this reservation? This cannot be undone.`
              );
              if (confirmation) {
                changeReservationStatus(
                  reservation_id,
                  "cancelled",
                  abortController.signal
                );
                history.go();
              }
            }}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  });

  return <>{listReservations}</>;
}
