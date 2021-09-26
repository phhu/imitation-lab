import React, { useState, useEffect } from 'react'

export default ({
  options=[],
  change=(value)=>{},
  values=(o,i)=>i,
  displayValues=(o,i)=>o.name,
  initial=0
}={}) => {

  const [value, setValue] = useState(initial)
  const onChange = e => {
    setValue(e.target.value)
    change(e.target.value)
  }

  return <select {...{value,onChange}}>
    {options.map((o,i) => <option 
      key={values(o,i)} 
      value={values(o,i)}>
        {displayValues(o,i)}
    </option>)}
  </select>

}