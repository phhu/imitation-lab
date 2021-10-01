import React from "react";

/* import Checkbox from './Checkbox'
  <Checkbox 
    checked={useClick} 
    label="Use click"
    onChange={x=>dispatch(actions.useClick(e.target.checked))}
  />    
*/

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