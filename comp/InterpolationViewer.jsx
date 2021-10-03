import React, {useState} from "react"
import {useDispatch, useSelector, useStore} from 'react-redux'
import BasicScore from './BasicScore'
import {chunk} from 'lodash'
import {sequencesIdentical} from '../compare'
import {doInterpolation} from '../interpolate'
import {Declutter} from './Declutter'
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
  const dispatch = useDispatch()
  const isInterpolating= useSelector(s=>s.interpolate.isInterpolating)  
  const [activeScore, setActiveScore] = useState(0)
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
    <Declutter>
      INTERPOLATION &nbsp;
      <button 
        title="(Re-)run Google Magenta interpolation to generate new melodies from SOURCES"
        onClick={()=>doInterpolation(dispatch)}
        className = {isInterpolating ? "interpolating": ""}
      >Interpolate</button>
    </Declutter>
    <table><tbody>
    {m2.map((mr,row)=>(
      <tr key={"row"+row}>
      {mr.map((m,col)=>{
        const currentlyViewed = (activeScore==(size*row+col))
        const currentTarget = (i.current==(size*row+col))
        const hasBeenMatched = (i?.matches?.[size*row+col])
        const currentlyMatched = (i?.currentMatches?.[size*row+col])
        return (
        <td key={"col"+col}>
          <button 
            className="interpolationButton"
            title={"View melody "+ (size*row+col) + 
              (currentlyViewed ? ' (Currently viewed)' :'') +
              (currentTarget ? ' (Current target)' :'') +
              (hasBeenMatched ? ' (has been matched)' :'')
            } 
            style={{
              backgroundColor: (
                currentTarget ? "blue":
                currentlyMatched ? "green" :
                hasBeenMatched ? "darkgreen":
                "inherit") 
              ,fontWeight: (currentlyViewed  ? "900":"normal") 
            }}
            onClick={()=>{
              setActiveScore(size*row+col)
              // play(m)
            }}
          >{getLabel(row,col)}</button>
        </td>
      )})}
      </tr>
    ))}
    </tbody></table>
    {/* for socre highlight: i.current==activeScore */}

      <BasicScore 
          scoreid={"activeScore"} 
          melody={i.melodies[activeScore]} 
          title={activeScore}
          highlight={false}
          index={activeScore}
          key="activeScore"
          padding="0px" 
          margin="0px"
        />
    {/* {i.melodies.map((m,idx)=>(<BasicScore 
        scoreid={"int"+idx} 
        melody={m} 
        title={idx}
        highlight={i.current==idx}
        index={idx}
        key={idx}
        padding="0px" 
        margin="0px"
      />))} */}
    {/* <pre>{JSON.stringify(i,null,2)}</pre>  */}
  </div>
)};
