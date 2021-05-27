import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function TableForm() {
  const history = useHistory();
  const abortController = new AbortController();

  const initialFormData = {
    table_name: "",
    capacity: 0,
    status: "free",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [error, setError] = useState(null);

  const formChangeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (validateFields()) {
      const newTable = await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
    }
  };

  const validateFields = () => {
    let foundError = [];

    if (formData.table_name === "") {
      foundError = { message: `Please fill out table name.` };
    } else if (!formData.capacity) {
      foundError = { message: `Please fill out table capacity.` };
    } else if (formData.table_name.length < 2) {
      foundError = { message: `Table name must be at least 2 characters` };
    }
    setError(foundError);

    return foundError.length === 0;
  };

  return (
    <main>
      <h1>Create New Table</h1>
      <form onSubmit={submitHandler}>
        <ErrorAlert error={error} />
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="text"
              minLength="2"
              value={formData.table_name}
              onChange={formChangeHandler}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="capacity">
              Table Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              max="12"
              min="1"
              value={formData.capacity}
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
    </main>
  );
}
