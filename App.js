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
import {nextMelody} from './next'
const {isQuantizedSequence} = core.sequences

function App() {
  const store=useStore()
  const tempo = useSelector(s=>s.tempo)
  const midiOutput = useSelector(s=>s.midiOutput)
  const {playClick} = useSelector(s=>s.player)
  const {
    isInterpolating,
    melodies:interpolatedMelodies
  } = useSelector(s=>s.interpolate)
  const dispatch = useDispatch()
  console.log("rendering app")
  const btnRecord = useRef()
  const btnStop = useRef()
  
  midiPlayer.playClick = playClick
  const playRec = (e) =>{
    const state= store.getState()
    midiPlayer.isPlaying() && midiPlayer.stop()
    recorder.isRecording() && recorder.stop()
    midiPlayer.start(
      state.memes.working.src,
      isQuantizedSequence(state.memes.working.src) ? store.getState().tempo : undefined
    )
    .then(()=>new Promise((resolve,reject)=>{
      btnRecord.current.click()
      setTimeout(()=>{
        btnStop.current.click()
        resolve(true)
      },4000)
    }))
    .then(()=>{
      setTimeout(()=>{
        midiPlayer.isPlaying() && midiPlayer.stop()
        recorder.isRecording() && recorder.stop()
        midiPlayer.start(store.getState().memes.recording.src)
      
      },50)
    })
  }
  useEffect(()=>{
    console.log("adding sostenuto pedal listener")
    const addPedalListener = (inputs) => {
      inputs.forEach(input => {
        input.addListener("controlchange","all",(e)=>{
          if (e.controller.name==="sustenutopedal" && e.value===127){
            playRec()
          }
        })
        // input.addListener("noteon","all",(e)=>{
          
        // })
      })
    }
    addPedalListener(WebMidi.inputs)
  },[])


  const doInterpolation = ()=>{
    console.log("interpolating")
    dispatch(interpolateMelodies({
      sources: ["a","c","b","d"]    
    }))
  }
  useEffect(()=>{
    if(interpolatedMelodies.length===0){
      doInterpolation()
    }
  },[interpolatedMelodies])

  // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
  return <div id="app" tabIndex={-1} onKeyUp={(e) => {
      //console.log("key",e)
      if (e.key===" "){
        playRec();
        e.preventDefault();
        return false;
       }
    }}>

    <Score scoreid="working" meme="working" title="WORKING" />
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

      <button onClick={()=>{
        dispatch(nextMelody())
      }}>Next</button>



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
        onClick={doInterpolation}
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
    <div className="box">
      SOURCES
      <Score scoreid="a" meme="a" title="A" padding="0px" margin="0px"/>
      <Score scoreid="b" meme="b" title="B" padding="0px" margin="0px"/>
      <Score scoreid="c" meme="c" title="C" padding="0px" margin="0px"/>
      <Score scoreid="d" meme="d" title="D" padding="0px" margin="0px"/>
    </div>
    <InterpolationViewer />
  
  </div>
}



export default App 
 
