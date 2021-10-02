import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
const {isQuantizedSequence} = core.sequences
import {forceQuantized} from '../utilsMelody'

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
    <div style={{
      margin,
      padding,
      backgroundColor: (highlight ? "#88f":"inherit")
    }}>
      {title && (<span>{title} </span>)}
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <div className="inline" id={scoreDivId}></div>
    </div>
  )
}

