import React, { useState, useEffect, useRef } from 'react'

export default function ValueInput({
  change = (value)=>{console.log("changed to",value)},
  initial = 0
}={}){
  const [value, setValue] = useState(initial)
  //const onChange = (value)=>{console.log("changed")}
  const onChange = e => {
    //console.log("changing")
    setValue(e.target.value)
    //change(e.target.value)
  }
  const prevValue = usePrevious(value)
  if (prevValue != value){
    change(value)
  }
  
  return <div>
      <input size="5" type="text"  {...{value,onChange}}></input>
      <button onClick={()=>setValue(parseInt(value)-1)}>-</button>
      <button onClick={()=>setValue(parseInt(value)+1)}>+</button>
    </div>
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