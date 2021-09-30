import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {forceQuantized,removeNonJson} from '../utilsMelody'
import {matchRecording} from '../compare'


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

export default function Recorder(props) {
  // let [recording, setRecording] = useState(BLANK)
  let [isRecording, setIsRecording] = useState(false)
  let [noteBeenPlayed, setNoteBeenPlayed] = useState(0)
  // useClick should be in global state...
  const recording = useSelector(s=>s?.memes?.recording?.src)
  const store = useStore()

  const dispatch = useDispatch()
  //console.log("recording",BLANK)
  recorder.callbackObject = {
    noteOn: function(a,b,c){
      //console.log("rec note on");
      setNoteBeenPlayed(1)
      setTimeout(()=>setNoteBeenPlayed(0),100)
    },
    //run:function(a,b,c){console.log("rec note run",tidyAndSetRec(a))},
  }
  const record = ()=>{
    //console.log("Record: start")
    //recorder.callbackObject = null

    recorder.enablePlayClick(
      document.getElementById("useClick").checked
    )
    recorder.setTempo(store.getState().tempo)
    recorder.start()
    //console.log("recording start")
    setIsRecording(true)
  }
  
  const tidyAndSetRec = fp.pipe(
    rec => trim(rec,
      rec.notes[0] && rec.notes[0].startTime,    //startTime
      rec.notes[0] && rec.notes[rec.notes.length-1].endTime,   //endTime
    ),
    //rec => (console.log("rec PreQuant",rec),rec),
    //rec => quantizeNoteSequence(rec, 8),    // stepsPerBeat
    //rec => ({...rec,tempos:[{qpm: 120, time: 0}]}),
    //rec => (console.log("rec PostQuant",rec),rec),
    removeNonJson,
    //rec=>dispatch(actions.recording(rec)), 
    rec=>dispatch(matchRecording(rec)), 
  )

  const stop = ()=>{
    //console.log("Record: stop")
    setIsRecording(false)
    tidyAndSetRec(recorder.stop()) 
  }

  return (
    <div style={{
      "margin":"10px",
      "padding":"5px",
      "backgroundColor": "#eee",
    }}>
      RECORDER
      <br />
      <button id="rec" ref={props.btnRecord} onClick={record} style={{
        backgroundColor: isRecording ? "red" : "inherit"
      }}>REC</button>
      <button id="stop"  ref={props.btnStop}  onClick={stop}>Stop</button>
      <input type="checkbox" id="useClick"></input>
      <label htmlFor="useClick">Use click</label>
      &nbsp;| <span>{noteBeenPlayed}</span>
      <Score 
        scoreid="Rec" 
        meme="recording" 
        hasSelect={false} 
        padding="0px" 
        margin="0px"
      />
    </div>
  )
}


