import React from "react"
import {useDispatch, useSelector, useStore} from 'react-redux'
import BasicScore from './BasicScore'
/* import Checkbox from './Checkbox'
  <Checkbox 
    checked={useClick} 
    label="Use click"
    onChange={x=>dispatch(actions.useClick(e.target.checked))}
  />    
*/

export const InterpolationViewer = ({ 
  label, 
  checked, 
  onChange 
}={}) => {
  const i = useSelector(s=>s.interpolate)
  return (
  <div className="box">
    INTERPOLATIONS
    {i.melodies.map((m,idx)=>(<BasicScore 
        scoreid={"int"+idx} 
        melody={m} 
        title={idx}
        key={idx}
        padding="0px" 
        margin="0px"
      />))}
    {/* <pre>{JSON.stringify(i,null,2)}</pre>  */}
  </div>
)};
