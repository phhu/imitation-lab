import React, { useState, useEffect, useRef } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
//import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import {Player} from './comp/Player'

//import Checkbox from './comp/Checkbox'
import ValueInput from './comp/ValueInput'
import LocalMidiInst from './comp/LocalMidiInst'
import {InterpolationViewer} from './comp/InterpolationViewer'
import {Declutter} from './comp/Declutter'
import {MelodySets} from './comp/MelodySets'
import {Provider, useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from './reduxStore'
import {delay} from './utilsMelody'
import {doInterpolation} from './interpolate'
import {nextMelody} from './next'
import {startPlayer, stopPlayer} from './transport'
const {isQuantizedSequence} = core.sequences
import {playDrumNow} from './transport'
 
function App() {
  const store=useStore()
  const tempo = useSelector(s=>s.tempo)

  const declutter = !!(useSelector(s=>s.declutter))
  const interpolatedMelodies = useSelector(s=>s.interpolate.melodies)
  const dispatch = useDispatch()
  console.log("rendering app")

  const [runningPlayReview, setRunningPlayReview] = useState(false)
  const [runningPlayRec, setRunningPlayRec] = useState(false)
  const [runningTimedRec, setRunningTimedRec] = useState(false)

  const btnRecord = useRef()
  const btnStopRecording = useRef()
  const btnRecPlay = useRef()
  const btnRecStop = useRef()  
  const btnTargetPlay = useRef()
  const btnTargetStop = useRef()  

  useEffect(()=>{
    //console.log("interpolatedMelodies",interpolatedMelodies.length===0,interpolatedMelodies)
    if(interpolatedMelodies.length===0){
      doInterpolation(dispatch)
    }
  },[interpolatedMelodies])  

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
  //useEffect(()=>{document.getElementById('app').focus()})

  const memeTimeMs = ({meme}) => {
    const state= store.getState()
    const {tempo} = state
    const m = state.memes[meme].src
    const lastNote = m?.notes?.slice(-1)?.[0]

    if (m.totalTime) {return m.totalTime * 1000}
    if (m.totalQuantizedSteps && m?.quantizationInfo?.stepsPerQuarter){
      const beats = parseInt(m.totalQuantizedSteps) / 
        parseInt(m.quantizationInfo.stepsPerQuarter)
      return 1000 * 60 * beats / tempo
    }
    return 1000 * 60 * 8 / tempo    // guess we have 8 beats
  }
  
  const playRec = (e) =>{
    //console.log("meme time",memeTimeMs({meme:"target"}))
    setRunningPlayRec(true)
    startPlayer({meme:"target"})
    .then(()=>new Promise((resolve,reject)=>{
      btnRecord.current.click()
      setTimeout(()=>{
        btnStopRecording.current.click()
        resolve(true)
      },memeTimeMs({meme:"target"})+750)
    }))
    .finally(()=>setRunningPlayRec(false))
  }

  const playReview = ()=>{
    setRunningPlayReview(true)
    startPlayer({meme:"recording"})
    //.then(()=>console.log("fin target start rec"))
    .then(delay(500))
    .then(()=>startPlayer({meme:"target"})  )
    //.then(()=>console.log("fin rec"))
    .catch(err=>err && console.error("playReview error",err))
    .finally(()=>{setRunningPlayReview(false)})
  }

  const timedRec = ()=>{
    setRunningTimedRec(true)
    //window.btnRecord = btnRecord.current
    btnRecord.current.click()
    setTimeout(
      ()=>{
        setRunningTimedRec(false)
        btnStopRecording.current.click()
      },
      memeTimeMs({meme:"target"})+1000
    )
  }
  // const testBtn = ()=>{
  //   console.log("testBtn",
  //     //btnTargetPlay.current.click() 
  //     startPlayer({meme:"target"})
  //     .then(()=>console.log("fin target start rec"))
  //     .then(()=>startPlayer({meme:"recording"})  )
  //     .then(()=>console.log("fin rec"))
  //     .catch(err=>err && console.error("testBtn error",err))
  //   )
  // }
  const next = ({direction=undefined}={}) => ()=>{ 
    const state = store.getState()
    if (!(state.requireMatchForNext) || 
    state?.memes?.target.matchesRecording){
      playDrumNow(63)   // 63 = mid tom, 62 =high, 64 =low, 65=snare
      dispatch(nextMelody({direction})) 
      setTimeout(()=>{
        console.log("play next")
        playRec()

        //btnTargetPlay.current.click()
      }, 200)
    } else {
      playDrumNow(65)
    }
  }

  const keyActions = {
    " ": ()=>{playRec() },
    "Alt": ()=>{playReview() },
    "AltGraph": ()=>{timedRec() },
    "ArrowRight": next({direction:[1,0]}),
    "ArrowLeft": next({direction:[-1,0]}),
    "ArrowUp": next({direction:[0,-1]}),
    "ArrowDown": next({direction:[0,1]}),
    "Escape":  ()=>{
      stopPlayer()
      btnStopRecording.current.click()
      btnTargetStop.current.click()
      btnRecStop.current.click()
      setRunningPlayReview(false)
      setRunningPlayRec(false)
      setRunningTimedRec(false)
    },
    "Enter": next({}),
  }
  const onKeyDown = (e) => {
    //console.log("key",e.key)
    if (keyActions[e.key]){
       keyActions[e.key]()
      e.preventDefault()
      return false 
     }  
  }
  // see https://www.midi.org/forum/1345-help-sysex-yamaha-cp33
  const midiReset = () => {
    WebMidi.outputs.forEach(o=>{
      o.stopNote("all")
      o.sendReset()
    })
  }

  const reset = ()=>{
    console.log("resetting, including midi reset")
    localStorage.removeItem("state")
    midiReset()
    window.location.reload(false)
  }

  // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
  return <div id="app" tabIndex={1} className={"app"} onKeyDown={onKeyDown }>
     
    <div className="title">
      <span id="title">IMITATION LAB</span>
      <span style={{float:"right"}}>
        <Declutter>
          <button 
            title="Print app state to browser console"
            onClick={()=>console.log(store.getState())}
          >State</button>
          <button 
            title="Reset application to defaults, reset MIDI, and reload"
            onClick={reset}
          >Reset</button>
          <button 
            title="Reset MIDI"
            onClick={midiReset}
          >MIDI Reset</button> 
          &nbsp;&nbsp;
        </Declutter> 
        <button 
          title="Toggle simplified UI"
          onClick={()=>dispatch(actions.declutter())}
        >{declutter ? "More..." : "...Less"}</button>
      </span>
    </div>

    <Score 
      scoreid="target" 
      meme="target" 
      title=" TARGET" 
      hasSave={true} 
      hasToWorking={false}
      btnPlay={btnTargetPlay}
      btnStop={btnTargetStop}
    />
    <Recorder {...{
      btnRecord,
      btnStopRecording, 
      btnRecPlay,
      btnRecStop 
    }} />
    
    <div className="box">
      {/* <Declutter>CONTROLS &nbsp;&nbsp;</Declutter> */}
      <button 
        onClick={playReview}
        style={{backgroundColor: (runningPlayReview? "green":"inherit")}}
        title="Play recording, then target for comparison [Alt]"
      >Review Play</button>
      <button 
        onClick={playRec}
        style={{backgroundColor: (runningPlayRec? "blue":"inherit")}} 
        title="Play target, then record. [Spacebar] (or sostenuto pedal)"
      >Play Rec</button>
      <button 
        onClick={timedRec}
        style={{backgroundColor: (runningTimedRec ? "red":"inherit")}}
        title="Record for the length of TARGET, stopping automatically [AltGr]"
      >Timed Rec</button>
      <button 
        onClick={next()}
        title="Go to next melody [enter]. Use arrow keys instead to choose direction of purple square on grid below"
      >Next</button>
      {/* 
      <button onClick={testBtn}>Test</button>
      <button onClick={()=>{ btnTargetStop.current.click() }}>Targ Stop</button>
      <button onClick={()=>{ btnRecPlay.current.click() }}>Rec Play</button>
      <button onClick={()=>{ btnRecStop.current.click() }}>Rec Stop</button>
      <button onClick={()=>{ btnRecord.current.click() }}>REC</button>
      <button onClick={()=>{ btnStopRecording.current.click() }}>REC STOP</button> 
      */}

      <MelodySets/>

      <Declutter>
        <ValueInput 
          size={1}
          label="Tempo" 
          title="Tempo for playback and recording [beats per minute]"
          value={tempo} 
          change={ x=>dispatch(actions.tempo(x)) } 
        />
      </Declutter>  
    </div>

    <Keyboard />
    
    <Declutter>
      <Player />
      <LocalMidiInst />    
    </Declutter>
    
    <InterpolationViewer />
    
    <Declutter>
      <div className="box">
        SOURCES
        <Score scoreid="a" meme="a" title="A" padding="0px" margin="0px"/>
        <Score scoreid="b" meme="b" title="B" padding="0px" margin="0px"/>
        <Score scoreid="c" meme="c" title="C" padding="0px" margin="0px"/>
        <Score scoreid="d" meme="d" title="D" padding="0px" margin="0px"/>
      </div>
    </Declutter>

  </div>
}



export default App 
 
