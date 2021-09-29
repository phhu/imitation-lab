import React, { useState, useEffect, useRef } from 'react'
//import {useDispatch, useSelector, useStore} from 'react-redux'

export default function ValueInput({
  change = (value)=>{console.log("changed to",value)},
  value = 0,
  validate = x=>parseInt(x),
  title = "",
  step = 1,
}={}){
  //const [value, setValue] = useState(initial)
  //const onChange = (value)=>{console.log("changed")}
  const onChange = e => {
    //console.log("changing")
    //setValue(e.target.value)
    change(e.target.value)
  }
  const prevValue = usePrevious(value)
  if (prevValue != value){
    //change(validate(value))
  }
  
  const makeOnClick = diff => e => {
    //shiftKey ctrlKey altKey metaKey
    if (e.shiftKey) {diff *=10}
    if (e.ctrlKey) {diff *=2}
    if (e.altKey) {diff *=12}
    change(parseFloat(value)+diff)
  }

  return <span>
      <span>{title} </span>
      <input size="5" type="text"  {...{value,onChange}}></input>
      <button onClick={makeOnClick(-parseFloat(step))}>-</button>
      <button onClick={makeOnClick(+parseFloat(step))}>+</button>
    </span>
}


// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}