import React, { useState, useEffect, useRef } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
//import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import Selector from './comp/Selector'
import ValueInput from './comp/ValueInput'
import LocalMidiInst from './comp/LocalMidiInst'

import {Provider, useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from './reduxStore'
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

  const playRec = (e) =>{
    const state= store.getState()
    midiPlayer.isPlaying() && midiPlayer.stop()
    recorder.isRecording() && recorder.stop()
    midiPlayer.start(state.memes.initial.src)
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

  // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
  return <div id="app" tabIndex={-1} onKeyUp={(e) => {
    //console.log("key",e)
    if (e.key===" "){playRec()}
  }}>
    <Score scoreid="1" meme="goal" />
    <Score scoreid="2" meme="initial" interpolationTarget="goal" />
    <Recorder {...{btnRecord,btnStop}} />
    <Keyboard />
    <Selector 
      options={midiPlayer.availableOutputs}
      value={midiOutput}
      change={(value)=>{
        midiPlayer.outputs = [midiPlayer.availableOutputs[value]]
        dispatch(actions.midiOutput(value))
        console.log("output changed to",value)
        const input = WebMidi.inputs[value]
        // input && input.addListener("noteon","all",(e)=>{
        //   const key = e.note.number
        //   console.log("key",key)
        // })
        input && input.addListener("controlchange","all",(e)=>{
          console.log("control",e)
          if (e.controller.name==="sustenutopedal" && e.value===127){
            console.log("playrec")
            playRec()
          }
        })
      }}
    />
    <ValueInput 
      title="Tempo" 
      value={tempo} 
      change={ x=>dispatch(actions.tempo(x)) } 
    />
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

    <button onClick={playRec}>PlayRec</button>

    <button onClick={()=>{
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
      console.log("resetting, including midi reset")
      localStorage.removeItem("state")
      window.location.reload(false)

      WebMidi.outputs.forEach(o=>{
        o.stopNote("all")
        o.sendReset()
      })
    }}>Reset</button>
  
  </div>
}



export default App 
 
