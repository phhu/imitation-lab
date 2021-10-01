import React from "react"
import {useDispatch, useSelector, useStore} from 'react-redux'
import BasicScore from './BasicScore'
import {chunk} from 'lodash'
const {isQuantizedSequence} = core.sequences
/* import Checkbox from './Checkbox'
  <Checkbox 
    checked={useClick} 
    label="Use click"
    onChange={x=>dispatch(actions.useClick(e.target.checked))}
  />    
*/


export const InterpolationViewer = ({ 
  //options
}={}) => {
  const store = useStore()
  const i = useSelector(s=>s.interpolate)
  const size = Math.round(Math.sqrt(i.melodies.length))
  const m2 = chunk(i.melodies,size)
  const play = (melody) => {
    //console.log('playing',scoreDivId,melody)
    midiPlayer.stop()
    midiPlayer.start(
      melody,
      isQuantizedSequence(melody) ? store.getState().tempo : undefined
    )
  }
  

  return (
  <div className="box">
    INTERPOLATIONS
    <table><tbody>
    {m2.map((mr,row)=>(
      <tr key={"row"+row}>
      {mr.map((m,col)=>(
        <td key={"col"+col}>
          <button style={{
            backgroundColor: (i.current==(size*row+col) ? "blue":"inherit")  
          }}
            onClick={()=>play(m)}
          >{(size*row+col)}</button>
        </td>
      ))}
      </tr>
    ))}
    </tbody></table>
    {i.melodies.map((m,idx)=>(<BasicScore 
        scoreid={"int"+idx} 
        melody={m} 
        title={idx}
        highlight={i.current==idx}
        key={idx}
        padding="0px" 
        margin="0px"
      />))}
    {/* <pre>{JSON.stringify(i,null,2)}</pre>  */}
  </div>
)};
