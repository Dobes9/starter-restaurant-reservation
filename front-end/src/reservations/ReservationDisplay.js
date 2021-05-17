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
      <tr key={reservation.reservation_id}>
        <td>{reservation_id}</td>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{readableTime}</td>
        <td>{people}</td>
        <td>{status}</td>
        <td>Set Table</td>
      </tr>
    );
  });

  return <>{listReservations}</>;
}
