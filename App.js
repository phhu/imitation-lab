import React, { useState, useEffect, useRef } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import OutputSelector from './comp/OutputSelector'
import ValueInput from './comp/ValueInput'
import LocalMidiInst from './comp/LocalMidiInst'

import {Provider, useDispatch, useSelector, useStore} from 'react-redux'
import {change} from './reduxStore'
import {makeNote} from './utilsMelody'
const melody = require('./melodies')

function App() {
  const store=useStore()
  const tempo = useSelector(s=>s.tempo)
  const midiOutput = useSelector(s=>s.midiOutput)
  const dispatch = useDispatch()
  console.log("rendering app")
  const btnRecord = useRef()
  const btnStop = useRef()
  return <div id="app">
    <Score scoreid="1" meme="goal" />
    <Score scoreid="2" meme="initial" />
    {/* <ScoreAsync title="Interpolated"  scoreid="3" melodies={[
      melody.LIBERTANGO,
      melody.TWINKLE_TWINKLE
    ]} /> */}
    <Keyboard />
    <Recorder {...{btnRecord,btnStop}} />
    <OutputSelector 
      options={midiPlayer.availableOutputs}
      value={midiOutput}
      change={(value)=>{
        midiPlayer.outputs = [midiPlayer.availableOutputs[value]]
        dispatch(change.midiOutput(value))
        console.log("output changed to",value)
      }}
    />
    <ValueInput title="Tempo" value={tempo} change={ x=>dispatch(change.tempo(x)) } />
    <LocalMidiInst />
    {/* <button onClick={()=>Tone.start()}>Start</button> */}

    <button onClick={()=>{
      console.log("playing seq")
      const state= store.getState()
      midiPlayer.stop()
      midiPlayer.setTempo(state.tempo)
      midiPlayer.start(state.memes.initial.src)
        // .then(()=>{
        //   console.log("playing 2")
        //   return midiPlayer.start(state.memes.initial.src)
        // })
        .then(()=>{
          console.log("playing 3")
          midiPlayer.start(state.memes.recording.src)
        })

    }}>play seq</button>
    <button onClick={()=>{
      console.log("btnRecord",btnRecord.current)
      //window.btnRecord = btnRecord.current
      btnRecord.current.click()
      setTimeout(()=>btnStop.current.click(),4000)
    }}>doRec</button>

    <hr />

    <button onClick={()=>{
      //console.log("playing note")
      const note = makeNote(51)    // {pitch:50,velocity:50}  
      midiPlayer.playNoteDown(note)
      setTimeout(()=>midiPlayer.playNoteUp(note) ,500)
    }}>play note</button>
    <button onClick={
      ()=>console.log(store.getState())
    }>State</button>
    <button onClick={()=>{
      console.log("resetting")
      localStorage.removeItem("state")
      window.location.reload(false)
    }}>Reset</button>
  
  </div>
}


export default App 
 
