import React, { useState, useEffect, useRef } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
//import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import {Player} from './comp/Player'
//import Selector from './comp/Selector'
//import Checkbox from './comp/Checkbox'
import ValueInput from './comp/ValueInput'
import LocalMidiInst from './comp/LocalMidiInst'
import {InterpolationViewer} from './comp/InterpolationViewer'
import {Declutter} from './comp/Declutter'
import {Provider, useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from './reduxStore'
//import {makeNote} from './utilsMelody'
import {doInterpolation} from './interpolate'
import {nextMelody} from './next'
const {isQuantizedSequence} = core.sequences
 
function App() {
  const store=useStore()
  const tempo = useSelector(s=>s.tempo)

  const declutter = !!(useSelector(s=>s.declutter))
  const interpolatedMelodies = useSelector(s=>s.interpolate.melodies)
  const dispatch = useDispatch()
  console.log("rendering app")
  const btnRecord = useRef()
  const btnStop = useRef()
  
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
  const next = ()=>{ dispatch(nextMelody()) }

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


  // const doInterpolation = ()=>{
  //   console.log("interpolating")
  //   dispatch(interpolateMelodies({
  //     sources: ["a","c","b","d"]    
  //   }))
  // }
  const keyActions = {
    " ": ()=>{playRec() },
    "ArrowRight":  next,
    "Escape":  ()=>{console.log("stop")},
  }
  useEffect(()=>{
    //console.log("interpolatedMelodies",interpolatedMelodies.length===0,interpolatedMelodies)
    if(interpolatedMelodies.length===0){
      doInterpolation(dispatch)
    }
  },[interpolatedMelodies])  //🎯
  // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
  return <div id="app" tabIndex={-1} onKeyUp={(e) => {
      //console.log("key",e.key)
      if (keyActions[e.key]){
        keyActions[e.key]()
        e.preventDefault()
        return false 
       }
    }}>
    
    <div className="title">
      <span>IMITATION LAB</span>
      <span style={{float:"right"}}>
        <Declutter>
        <button 
          title="Print app state to browser console"
          onClick={
            ()=>console.log(store.getState())
          }
        >State</button>
        &nbsp;
        <button 
          title="Reset application to defaults, reset MIDI, and reload"
          onClick={()=>{
            console.log("resetting, including midi reset")
            localStorage.removeItem("state")
            WebMidi.outputs.forEach(o=>{
              o.stopNote("all")
              o.sendReset()
            })
            window.location.reload(false)
          }}
        >Reset</button> &nbsp;&nbsp;
        </Declutter> 
        <button 
          title="Toggle simplified UI"
          onClick={()=>dispatch(actions.declutter())}
        >{declutter ? "More..." : "...Less"}</button>


      </span>
    </div>

    <Score scoreid="working" meme="working" title=" TARGET" hasSave={true} hasToWorking={false} />
    <Recorder {...{btnRecord,btnStop}} />
    
    <div className="box">
      {/* <Declutter>CONTROLS &nbsp;&nbsp;</Declutter> */}
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

      <button onClick={next}>Next</button>
      <ValueInput 
          size={1}
          label="Tempo" 
          title="Tempo for playback and recording [beats per minute]"
          value={tempo} 
          change={ x=>dispatch(actions.tempo(x)) } 
        />

    </div>

    <Keyboard />
     
    <Declutter>
      <Player />
      <LocalMidiInst />
      <InterpolationViewer />

      <div className="box">
        SOURCES
        <Score scoreid="a" meme="a" title="A" padding="0px" margin="0px"/>
        <Score scoreid="b" meme="b" title="B" padding="0px" margin="0px"/>
        <Score scoreid="c" meme="c" title="C" padding="0px" margin="0px"/>
        <Score scoreid="d" meme="d" title="D" padding="0px" margin="0px"/>
      </div>

      {/* <div className="box">
        DEBUG &nbsp;&nbsp;
      </div> */}
    </Declutter>
  </div>
}



export default App 
 
