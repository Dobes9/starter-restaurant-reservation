import React, { useState } from "react";
import ListReservations from "../reservations/ListReservations";

export default function SearchByMobileNumber() {
  const [formData, setFormData] = useState(null);

  const formChangeHandler = ({ target }) => {
    setFormData(target.value);
  };

  return (
    <>
      <form>
        <div className="row mt-3">
          <div className="col-6 form-group">
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="search"
              value={formData}
              onChange={formChangeHandler}
              placeholder="Enter a customer's phone number"
              required
            />
          </div>
          <div className="col-6 form-group">
            <button className="btn btn-primary" type="submit">
              Find
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
