import React, { useState, useEffect } from 'react'
import Score from './Score'
const {BLANK} = require('../melodies')
const {trim, quantizeNoteSequence} = core.sequences
const fp = require('lodash/fp')

const recorder = new core.Recorder()
recorder.setTempo(120)
recorder.enablePlayClick(true)

//should really wait for this
Promise.all([
  recorder.initialize()
])

export default (props) => {
  let [recording, setRecording] = useState(BLANK)
  let [isRecording, setIsRecording] = useState(false)
  console.log("recording",BLANK)
  const record = ()=>{
    console.log("Record: start")
    recorder.callbackObject = null
    recorder.enablePlayClick(
      document.getElementById("useClick").checked
    )
    recorder.start()
    console.log("recording start")
    setIsRecording(true)
  }
  
  const stop = ()=>{
    console.log("Record: stop")
    setIsRecording(false)
    fp.pipe(
      rec => trim(rec,
        rec.notes[0] && rec.notes[0].startTime,    //startTime
        rec.notes[0] && rec.notes[rec.notes.length-1].endTime,   //endTime
      ),
      rec => quantizeNoteSequence(rec, 8),    // stepsPerBeat
      rec=>setRecording(rec), 
    )(recorder.stop()) 
  }

  return (
    <div style={{
      "margin":"10px",
      "padding":"5px",
      "backgroundColor": "#eee",
    }}>
      RECORDER
      <br />
      <button id="rec" onClick={record} style={{
        backgroundColor: isRecording ? "red" : "inherit"
      }}>REC</button>
      <button id="stop" onClick={stop}>Stop</button>
      <input type="checkbox" id="useClick"></input><label htmlFor="useClick">Use click</label>
      <Score scoreid="Rec" melody={recording}/>
    </div>
  )
}