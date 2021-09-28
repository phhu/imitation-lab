import React, { useState, useEffect } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import OutputSelector from './comp/OutputSelector'
import ValueInput from './comp/ValueInput'

import {Provider, useDispatch, useSelector, useStore} from 'react-redux'
import {change} from './reduxStore'

const melody = require('./melodies')

function App() {
  const test={test:1}
  const store=useStore()
  const tempo = useSelector(s=>s.tempo)
  const dispatch = useDispatch()
  console.log("rendering app")
  return <div id="app">
    <Score scoreid="1" meme="goal" />
    <Score scoreid="2" meme="initial" />
    {/* <ScoreAsync title="Interpolated"  scoreid="3" melodies={[
      melody.LIBERTANGO,
      melody.TWINKLE_TWINKLE
    ]} /> */}
    <Keyboard />
    {/* <Recorder {...test}/> */}
    <OutputSelector 
      options={midiPlayer.availableOutputs}
      initial={1}
      change={(value)=>{
        midiPlayer.outputs = [midiPlayer.availableOutputs[value]]
        //window.midiThru = WebMidi.outputs[value]
        console.log("output changed to",value)
      }}
    />
    <ValueInput initial={tempo} change={x=>{
      dispatch(change.tempo(x))
      console.log("setting tempo",x)
    }} />

    <button onClick={()=>Tone.start()}>Start</button>
    <button onClick={()=>console.log(store.getState())}>State</button>
    <button onClick={()=>{console.log("playing note");midiPlayer.playNoteDown({pitch:51,velocity:50})}}>play note</button>
  </div>
}


export default App 
 
