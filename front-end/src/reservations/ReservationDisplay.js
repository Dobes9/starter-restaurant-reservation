import React from "react";

export default function ReservationDisplay({ reservations }) {
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
      </tr>
    );
  });

  return <>{listReservations}</>;
}
