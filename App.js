import React, { useState, useEffect, useRef } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
//import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import Selector from './comp/Selector'
import Checkbox from './comp/Checkbox'
import ValueInput from './comp/ValueInput'
import LocalMidiInst from './comp/LocalMidiInst'
import {InterpolationViewer} from './comp/InterpolationViewer'

import {Provider, useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from './reduxStore'
import {makeNote} from './utilsMelody'
import {interpolateMelodies} from './interpolate'

function App() {
  const store=useStore()
  const tempo = useSelector(s=>s.tempo)
  const midiOutput = useSelector(s=>s.midiOutput)
  const {playClick} = useSelector(s=>s.player)
  const {isInterpolating} = useSelector(s=>s.interpolate)
  const dispatch = useDispatch()
  console.log("rendering app")
  const btnRecord = useRef()
  const btnStop = useRef()
  
  midiPlayer.playClick = playClick
  const playRec = (e) =>{
    const state= store.getState()
    midiPlayer.isPlaying() && midiPlayer.stop()
    recorder.isRecording() && recorder.stop()
    midiPlayer.start(state.memes.working.src)
    .then(()=>new Promise((resolve,reject)=>{
      btnRecord.current.click()
      setTimeout(()=>{
        btnStop.current.click()
        resolve(true)
      },4000)
    }))
    .then(()=>{
      //setTimeout(()=>{
        midiPlayer.start(store.getState().memes.recording.src)
      
      //},0)
    })
  }
  const addPedalListener = (inputs) => {
    inputs.forEach(input => {
      input.addListener("controlchange","all",(e)=>{
        if (e.controller.name==="sustenutopedal" && e.value===127){
          playRec()
        }
      })
      input.addListener("noteon","all",(e)=>{
        
      })
    })
  }
  addPedalListener(WebMidi.inputs)
  // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
  return <div id="app" tabIndex={-1} onKeyUp={(e) => {
      //console.log("key",e)
      if (e.key===" "){playRec()}
    }}>
    <Score scoreid="1" meme="goal" title="GOAL" />
    {/* <Score scoreid="2" meme="initial" title="INITIAL" /> */}
    <Score scoreid="3" meme="working" title="WORKING" />
    <Recorder {...{btnRecord,btnStop}} />
    <Keyboard />
   
    <LocalMidiInst />
    {/* <button onClick={()=>Tone.start()}>Start</button> */}

    <div className="box">
      CONTROLS &nbsp;&nbsp;
      Midi out <Selector 
        options={midiPlayer.availableOutputs}
        value={midiOutput}
        change={(value)=>{
          midiPlayer.outputs = [midiPlayer.availableOutputs[value]]
          dispatch(actions.midiOutput(value))
          console.log("output changed to",value)
        }}
      /> &nbsp;&nbsp;
      <ValueInput 
        title="Tempo" 
        value={tempo} 
        change={ x=>dispatch(actions.tempo(x)) } 
      />
      <Checkbox 
        checked={playClick} 
        label="Click on play"
        onChange={e=>dispatch(actions.playClick(e.target.checked))}
      /> 
      <br />
      <button onClick={()=>{
        console.log("playing seq")
        const state= store.getState()
        midiPlayer.stop()
        midiPlayer.setTempo(state.tempo)
        midiPlayer.start(state.memes.working.src)
          .then(()=>{
            console.log("playing 3")
            midiPlayer.start(state.memes.recording.src)
          })

      }}>Play Review</button>

      <button onClick={playRec}>Play Rec Review</button>

      <button onClick={()=>{
        //window.btnRecord = btnRecord.current
        btnRecord.current.click()
        setTimeout(()=>btnStop.current.click(),4000)
      }}>Timed Rec</button>
    </div>

    <div className="box">
      DEBUG &nbsp;&nbsp;
      {/* <button onClick={()=>{
        //console.log("playing note")
        const note = makeNote(51)    // {pitch:50,velocity:50}  
        midiPlayer.playNoteDown(note)
        setTimeout(()=>midiPlayer.playNoteUp(note) ,500)
      }}>play note</button> */}
      <button 
        onClick={()=>{
          dispatch(interpolateMelodies({source: "working", target:"goal"}))
        }}
        className = {isInterpolating ? "interpolating": ""}
      >Interpolate</button>
      <button onClick={
        ()=>console.log(store.getState())
      }>State</button>
      <button onClick={()=>{
        console.log("resetting, including midi reset")
        localStorage.removeItem("state")
        window.location.reload(false)

        WebMidi.outputs.forEach(o=>{
          o.stopNote("all")
          o.sendReset()
        })
      }}>Reset</button>
    </div>
    <InterpolationViewer />
  
  </div>
}



export default App 
 
