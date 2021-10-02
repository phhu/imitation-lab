import React, { useState, useEffect } from 'react'

export default ({
  options=[],
  change=(value)=>{},
  values=(o,i)=>i,
  displayValues=(o,i)=>o.name,
  value=0,
  ...args
}={}) => {

  const onChange = e => {
    change(e.target.value)
  }

  return <select {...{value,onChange,...args}}>
    {options.map((o,i) => <option 
      key={values(o,i)} 
      value={values(o,i)}>
        {displayValues(o,i)}
    </option>)}
  </select>

}