import React, { useState } from "react";
import ListReservations from "../reservations/ListReservations";
import { listReservations } from "../utils/api";

export default function SearchByMobileNumber() {
  const [formData, setFormData] = useState(null);
  const [results, setResults] = useState([]);
  const [displayResults, setDisplayResults] = useState(false);

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
      {displayResults ? (
        results.length ? (
          <ListReservations reservations={results} />
        ) : (
          <h4>No resevations found</h4>
        )
      ) : null}
    </>
  );
}
