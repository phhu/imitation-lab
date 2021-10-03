import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {forceQuantized,removeNonJson} from '../utilsMelody'
import {matchRecording} from '../compare'
import Checkbox from './Checkbox'
import {Declutter} from './Declutter'

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

export default function Recorder({
   btnRecord,
   btnStopRecording, 
   btnRecPlay,
   btnRecStop, 
}={}) {
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
  useEffect(()=>{    // state might be saved while recording, so make sure is false
    dispatch(actions.isRecording(false))
  },[])

  recorder.callbackObject = {
    noteOn: function(a,b,c){
      dispatch(actions.noteJustPlayed(true))
      //setNoteBeenPlayed(1)
      setTimeout(()=>dispatch(actions.noteJustPlayed(false)),100)  //setNoteBeenPlayed(0)
    },
    run: (rec) =>{
      //console.log("rec note run",rec)
      dispatch(matchRecording({sendRecording:false,playSound:false})(rec))
    },
  }
  const record = ()=>{
    //console.log("Record: start")
    //recorder.callbackObject = null

    recorder.enablePlayClick(useClick)
    recorder.setTempo(store.getState().tempo)
    
    if (recorder.isRecording()){
      stop()
    } else {
      dispatch(actions.isRecording(true))
      recorder.start()
    }

  }
  const stop = ()=>{
    //console.log("Record: stop")
    dispatch(actions.isRecording(false))
    tidyAndSetRec(recorder.stop()) 
  }

  const tidyAndSetRec = fp.pipe(
    rec => (rec===null ? rec :trim(rec,
      rec.notes[0] && rec.notes[0].startTime,    //startTime
      rec.notes[0] && rec.notes[rec.notes.length-1].endTime,   //endTime
    )),
    //rec => quantizeNoteSequence(rec, 8),    // stepsPerBeat
    //rec => ({...rec,tempos:[{qpm: 120, time: 0}]}),
    //rec => (console.log("rec PostQuant",rec),rec),
    removeNonJson,
    rec=>dispatch(matchRecording({
      sendRecording:true,
      playSound:true,
      playSoundOnFail:true,
      checkInterpolations:true,
    })(rec)), 
  ) 

  return (
    <div style={{
      "margin":"8px",
      "padding":"5px",
      "backgroundColor": "#eee",
    }}>
      RECORDER &nbsp;&nbsp;
      <button 
        id="btnRec" 
        ref={btnRecord} 
        title="Record / stop recording. After stopping, TARGET will show in green if the recording matches it"
        onClick={record} 
        style={{
          width: "4.5em", 
          padding:"0px", 
          backgroundColor: isRecording ? "red" : "inherit"
        }
      }>{isRecording?"⏹STOP":"⏺ REC"}</button>
      
      <code>{noteJustPlayed?'♪':'\u00A0'}</code> 
      
      <button 
        id="btnRecStop"
        ref={btnStopRecording}
        onClick={stop}
      >■</button>
      


      <Score 
        scoreid="Rec" 
        meme="recording" 
        hasSelect={false} 
        padding="0px" 
        margin="0px"
        divClassName="inline"
        hasSave={true}
        btnPlay={btnRecPlay}
        btnStop={btnRecStop}
      >
        <Declutter>
          <Checkbox 
            checked={useClick} 
            label="Use click"
            onChange={e=>dispatch(actions.useClick(e.target.checked))}
          />    
        </Declutter>
      </Score>

    </div>
  )
}


