import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { today } from "../utils/date-time";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationForm() {
  const history = useHistory();
  const abortController = new AbortController();
  const signal = abortController.signal;

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [dateErrors, setDateErrors] = useState([]);

  const formChangeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (validateDate()) {
      createReservation(formData, signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }
  };

  function validateDate() {
    const reservationDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );
    const todaysDate = new Date(today());

    const foundErrors = [];

    // Validation to check if reservation date is not a Tuesday
    if (reservationDate.getUTCDay() === 2) {
      foundErrors.push({
        message: `Reservation cannot be made: Restaurant is closed on Tuesdays.`,
      });
    }

    // Validation to check if reservation date is not a past date
    if (reservationDate < todaysDate) {
      foundErrors.push({
        message: `Reservations cannot be made: Date is in the past.`,
      });
    }

    // Validation to check if reseration is before 10:30 AM
    if (
      reservationDate.getHours() < 10 ||
      (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30)
    ) {
      foundErrors.push({
        message: `Reservation cannot be made: Restaurant is closed until 10:30 AM`,
      });
    }

    // Validation to check if reservation is after 10:30 PM
    if (
      reservationDate.getHours() > 22 ||
      (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)
    ) {
      foundErrors.push({
        message: `Reservation cannot be made: Restaurant closes at 10:30 PM`,
      });
    }

    // Validation to check if reservation has at least 1 hour before restaurant closes
    if (
      reservationDate.getHours() > 21 ||
      (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30)
    ) {
      foundErrors.push({
        message: `Reservation cannot be made: Reservation must be made for at least 1 hour before closing (10:30 PM).`,
      });
    }
    setDateErrors(foundErrors);

    return foundErrors.length === 0;
  }

  const displayErrors = () => {
    return dateErrors.map((error, index) => (
      <ErrorAlert key={index} error={error} />
    ));
  };

  return (
    <form onSubmit={submitHandler}>
      <div>{displayErrors()}</div>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="first_name">
            First Name:
          </label>
          <input
            className="form-control"
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={formChangeHandler}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="last_name">
            Last Name:
          </label>
          <input
            className="form-control"
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={formChangeHandler}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="mobile_number">
            Mobile Number:
          </label>
          <input
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            type="tel"
            placeholder="XXX-XXX-XXXX"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            value={formData.mobile_number}
            onChange={formChangeHandler}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="reservation_date">
            Reservation Date:
          </label>
          <input
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            value={formData.reservation_date}
            onChange={formChangeHandler}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="reservation_time">
            Reservation Time:
          </label>
          <input
            className="form-control"
            id="reservation_time"
            name="reservation_time"
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            value={formData.reservation_time}
            onChange={formChangeHandler}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6 form-group">
          <label className="form-label" htmlFor="people">
            People:
          </label>
          <input
            className="form-control"
            id="people"
            name="people"
            type="number"
            max="12"
            min="1"
            value={formData.people}
            onChange={formChangeHandler}
            required
          />
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
