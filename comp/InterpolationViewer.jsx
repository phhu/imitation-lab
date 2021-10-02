import React from "react"
import {useDispatch, useSelector, useStore} from 'react-redux'
import BasicScore from './BasicScore'
import {chunk} from 'lodash'
import {sequencesIdentical} from '../compare'
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
  const {memes} = store.getState()
  const testMatch = (row,col,meme) => {
    //console.log ("testMatch",row,col,m2[row][col],memes[meme]?.src,sequencesIdentical(m2[row][col],memes[meme]?.src))
    return sequencesIdentical(m2[row][col],memes[meme]?.src)
  }
  const getLabel = (row,col) => 
   testMatch(row,col,'a') ? "A" :     // (row===0 && col===0)
   testMatch(row,col,'b') ? "B" :
   testMatch(row,col,'c') ? "C" :
   testMatch(row,col,'d') ? "D" :
    (size*row+col)
  
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
          >{getLabel(row,col)}</button>
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
