import React from "react";

const Checkbox = ({ label, checked, onChange }) => (
  <span className="form-check">
    <label>
      <input
        type="checkbox"
        className="form-check-input"
        name={label}
        {...{checked, onChange}}
      />
      {label}
    </label>
  </span>
);

export default Checkbox;