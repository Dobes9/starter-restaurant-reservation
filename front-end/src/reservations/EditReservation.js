import React from "react";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  return (
    <main>
      <h1>Edit Existing Reservation</h1>
      <ReservationForm edit={true} />
    </main>
  );
}
