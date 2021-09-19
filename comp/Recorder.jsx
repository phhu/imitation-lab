import React, { useState, useEffect } from 'react'
import Score from './Score'
const {trim, quantizeNoteSequence} = core.sequences

const recorder = new core.Recorder();
recorder.setTempo(120);
recorder.enablePlayClick(true);

Promise.all([
  recorder.initialize()
])



export default (props) => {
  let [recording, setRecording] = useState([])

  const record = ()=>{
    console.log("Record: start")
    recorder.callbackObject = null;
    recorder.enablePlayClick(
      true //document.getElementById("useClick").checked
    );
    recorder.start();
    console.log("recording start"); 
    //document.getElementById("RECORD (midi)").style['background-color'] =  'red'
  }
  
  const stop = ()=>{
    console.log("Record: stop")
    let rec = recorder.stop();
    //document.getElementById("RECORD (midi)").style['background-color'] =  'inherit'
    //console.log("recording stop. Rec:",rec);
    const stepsPerBeat = 4;
    //const stepsPerBar = 4 * stepsPerBeat;
    const startTime = rec.notes[0] && rec.notes[0].startTime ;
    const endTime = rec.notes[0] && rec.notes[rec.notes.length-1].endTime ;
    rec = trim(rec,startTime,endTime);
    rec = quantizeNoteSequence(rec,stepsPerBeat)
    console.log("recording quantized and trimmed:",rec)
    setRecording(rec)    
    //showRecording(rec);
    //testRecordings();
  }

  return (
    <div style={{
      "margin":"10px",
      "backgroundColor": "#ddd",
    }}>
      RECORDER {props.test}
      <br />
      <input type="checkbox" id="useClick"></input><label htmlFor="useClick">Use click</label>
      <button id="rec" onClick={record}>REC</button>
      <button id="stop" onClick={stop}>Stop</button>
      <Score melody={recording}/>
    </div>
  )
}