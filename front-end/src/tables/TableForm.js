import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function TableForm() {
  const history = useHistory();
  const initialFormData = {
    table_name: "",
    capacity: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const formChangeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  return (
    <form>
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
            
        </div>
      </div>
      <div>
        <button className="btn btn-secondary mx-1">Cancel</button>
        <button className="btn btn-primary mx-1" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
