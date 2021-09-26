import React, { useState, useEffect } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import OutputSelector from './comp/OutputSelector'
import ValueInput from './comp/ValueInput'

const melody = require('./melodies')

// 
function App() {
  const test={test:1}
  return (
    <div id="root">
      <Score title="Melody 1" scoreid="1" melody={melody.LIBERTANGO} />
      <Score title="Twinkle"  scoreid="2" melody={melody.TWINKLE_TWINKLE} />
      <ScoreAsync title="Interpolated"  scoreid="3" melodies={[melody.LIBERTANGO,melody.TWINKLE_TWINKLE]} />
      <Keyboard />
      <Recorder {...test}/>
      <OutputSelector 
        options={midiPlayer.availableOutputs}
        initial={1}
        change={(value)=>{
          midiPlayer.outputs = [midiPlayer.availableOutputs[value]]
          //window.midiThru = WebMidi.outputs[value]
          console.log("output changed to",value)
        }}
      />
      <ValueInput initial="120" />

      <button onClick={()=>Tone.start()}>Start</button>
      <button onClick={()=>{console.log("playing note");midiPlayer.playNoteDown({pitch:51,velocity:50})}}>play note</button>
    </div>
  );
}


export default App 
 
