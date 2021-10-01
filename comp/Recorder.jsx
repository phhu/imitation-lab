import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {forceQuantized,removeNonJson} from '../utilsMelody'
import {matchRecording} from '../compare'
import Checkbox from './Checkbox'

import Score from './Score'
const {trim, quantizeNoteSequence} = core.sequences
const fp = require('lodash/fp')

const recorder = new core.Recorder()
recorder.setTempo(120)
recorder.enablePlayClick(true)
window.recorder = recorder
//should really wait for this
Promise.all([
  recorder.initialize()
])

export default function Recorder(props) {
  //let [isRecording, setIsRecording] = useState(false)
  //let [noteBeenPlayed, setNoteBeenPlayed] = useState(0)
  // useClick should be in global state...
  const {
    isRecording, 
    useClick,
    noteJustPlayed,
  } = useSelector(s=>s.recorder)
  const store = useStore()
  const dispatch = useDispatch()

  recorder.callbackObject = {
    noteOn: function(a,b,c){
      dispatch(actions.noteJustPlayed(true))
      //setNoteBeenPlayed(1)
      setTimeout(()=>dispatch(actions.noteJustPlayed(false)),100)  //setNoteBeenPlayed(0)
    },
    //run:function(a,b,c){console.log("rec note run",tidyAndSetRec(a))},
  }
  const record = ()=>{
    //console.log("Record: start")
    //recorder.callbackObject = null

    recorder.enablePlayClick(useClick)
    recorder.setTempo(store.getState().tempo)
    recorder.start()
    //console.log("recording start")
    dispatch(actions.isRecording(true))
  }
  
  const tidyAndSetRec = fp.pipe(
    rec => (rec===null ? rec :trim(rec,
      rec.notes[0] && rec.notes[0].startTime,    //startTime
      rec.notes[0] && rec.notes[rec.notes.length-1].endTime,   //endTime
    )),
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
    dispatch(actions.isRecording(false))
    tidyAndSetRec(recorder.stop()) 
  }

  return (
    <div style={{
      "margin":"10px",
      "padding":"5px",
      "backgroundColor": "#eee",
    }}>
      RECORDER &nbsp;&nbsp;
      <button id="rec" ref={props.btnRecord} onClick={record} style={{
        backgroundColor: isRecording ? "red" : "inherit"
      }}>REC</button>
      <button id="stop"  ref={props.btnStop}  onClick={stop}>Stop</button>
      <Checkbox 
        checked={useClick} 
        label="Use click"
        onChange={e=>dispatch(actions.useClick(e.target.checked))}
      />    
      {/* <input type="checkbox" id="useClick"></input>
      <label htmlFor="useClick">Use click</label> */}
      &nbsp; <span>{noteJustPlayed?'♪':''}</span>
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


