import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
const {isQuantizedSequence} = core.sequences
import {forceQuantized} from '../utilsMelody'
import {actions} from '../reduxStore'

export default ({
  melody,
  title,
  scoreid,
  highlight = false,
  margin="10px", 
  padding="5px",
}) => {

  const scoreDivId = `score${scoreid}`
  const store = useStore()
  const dispatch = useDispatch()
  useEffect(() => {
    try {
      // WaterfallSVGVisualizer is bad...
      const staff = new core.StaffSVGVisualizer(       
        forceQuantized({stepsPerQuarter:4})(melody),    
        document.getElementById(scoreDivId)
      )
    } catch(e){
      console.error("no score to draw",e)
      //console.error("Error in StaffSVGVisualizer:",e)
    }
  },[melody])

  const play = () => {
    midiPlayer.stop()
    midiPlayer.start(
      melody,
      isQuantizedSequence(melody) ? store.getState().tempo : undefined
    )
  }
  const stop = () => {
    midiPlayer.stop()
  }
  return (
    <div  style={{
      margin,
      padding,
      backgroundColor: (highlight ? "#88f":"inherit")
    }}>
      <table>
        <tbody><tr>
          <td>
            {title && (<span>{title} </span>)}
          </td>
          <td>
            <button onClick={play}>▶</button>
            <button onClick={stop}>■</button>
            <button onClick={()=>dispatch(actions.melodyToWorking(melody))}>🎯</button>
            {  true &&
              <button onClick={()=>dispatch(actions.saveMelody({
                melody, 
                name:window.prompt("Save melody name:","saved melody")
              }))}>💾</button>
            }
          </td>
          <td>
          <div className="inlineBlock"  id={scoreDivId}></div>
          </td>
        </tr></tbody>
      </table>

    </div>
  )
}

