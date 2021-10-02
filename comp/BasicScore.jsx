import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
const {isQuantizedSequence} = core.sequences
import {forceQuantized} from '../utilsMelody'
import {actions} from '../reduxStore'
import {BLANK} from '../melodies'
export default ({
  melody=BLANK,
  title,
  scoreid,
  index=undefined,
  highlight = false,
  margin="10px", 
  padding="5px",
}) => {

  const scoreDivId = `score${scoreid}`
  const store = useStore()
  const dispatch = useDispatch()
  const declutter = useSelector(s=>s.declutter)
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
  },[melody,declutter])

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
      backgroundColor: (highlight ? "#aaf":"inherit")
    }}>
      <table>
        <tbody><tr>
          <td>
            {title && (<span style={{fontWeight:"900"}}>{title} </span>)}
          </td>
          <td>
            <button title="Play this melody" onClick={play}>▶</button>
            <button title="Stop playing this melody" onClick={stop}>■</button>
            <button title="Set TARGET to this melody"
              onClick={()=>dispatch(actions.melodyToWorking({
                melody,
                newCurrent: index,
              }))}
            >🎯</button>
            {  true &&
              <button 
                title="Save melody (will appear in drop down lists)"
                onClick={()=>dispatch(actions.saveMelody({
                  melody, 
                  name:window.prompt("Save melody name:","saved melody")
                }))}
              >💾</button>
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


/*
<button title="Play this melody" onClick={play}>▶</button>
<button title="Stop playing this melody" onClick={stop}>■</button>
<Declutter>
  <button 
    title="Produce a variation of this melody using Google Magenta"
    onClick={vary} id={varyButtonId} style={{
    backgroundColor: isVarying ? "green": undefined
  }}>Vary{variationCount?` (${variationCount})`:''}</button>

  { hasToWorking &&
    <button 
      title="Set TARGET to this melody"
      onClick={()=>dispatch(actions.memeToWorking(meme))}
    >🎯</button>
  }
  {  hasSave &&
    <button 
      title="Save melody (will appear in drop down lists)"
      onClick={()=>dispatch(actions.saveMelody({
        meme, 
        name:window.prompt("Save melody name:","saved melody")



*/