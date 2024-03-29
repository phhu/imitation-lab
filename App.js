import React, { useState, useEffect, useRef } from 'react'
// const fp = require('lodash/fp')
// import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
// import ScoreAsync from './comp/ScoreAsync'
import Recorder from './comp/Recorder'
import { Player } from './comp/Player'

// import Checkbox from './comp/Checkbox'
import ValueInput from './comp/ValueInput'
import LocalMidiInst from './comp/LocalMidiInst'
import { InterpolationViewer } from './comp/InterpolationViewer'
import { Declutter } from './comp/Declutter'
import { MelodySets } from './comp/MelodySets'
import { Provider, useDispatch, useSelector, useStore } from 'react-redux'
import { actions } from './reduxStore'
import { delay } from './utilsMelody'
import { doInterpolation } from './interpolate'
import { nextMelody } from './next'
import { startPlayer, stopPlayer, playDrumNow } from './transport'

const { isQuantizedSequence } = core.sequences

function App () {
  const store = useStore()
  const tempo = useSelector(s => s.tempo)

  const declutter = !!(useSelector(s => s.declutter))
  const interpolatedMelodies = useSelector(s => s.interpolate.melodies)
  const dispatch = useDispatch()
  console.log('rendering app')

  const [runningPlayReview, setRunningPlayReview] = useState(false)
  const [runningPlayRec, setRunningPlayRec] = useState(false)
  const [runningTimedRec, setRunningTimedRec] = useState(false)

  const btnRecord = useRef()
  const btnStopRecording = useRef()
  const btnRecPlay = useRef()
  const btnRecStop = useRef()
  const btnTargetPlay = useRef()
  const btnTargetStop = useRef()

  useEffect(() => {
    // console.log("interpolatedMelodies",interpolatedMelodies.length===0,interpolatedMelodies)
    if (interpolatedMelodies.length === 0) {
      doInterpolation(dispatch)
    }
  }, [interpolatedMelodies])

  useEffect(() => {
    console.log('adding sostenuto pedal listener')
    const addPedalListener = (inputs) => {
      inputs.forEach(input => {
        let pedalDownTime = 0 // don't use react state - no need to rerender
        input.addListener('controlchange', 'all', (e) => {
          if (e.controller.name === 'sustenutopedal') {
            if (e.value === 127) {
              pedalDownTime = Date.now()
            } else {
              const diff = Date.now() - pedalDownTime
              if (diff > 0 && diff < 300) {
                console.log('pedal: playRec', diff)
                playRec()
              } else if (diff >= 300 && diff < 1500) {
                console.log('pedal: next', diff)
                next({})()
              } else if (diff >= 1500 && diff < 3000) {
                console.log('pedal: playReveiw', diff)
                playReview()
              } else {
                console.log('pedal: not recognised', diff)
              }
            }
          }
        })
        // input.addListener("noteon","all",(e)=>{
        // })
      })
    }
    addPedalListener(WebMidi.inputs)
  }, [])
  // useEffect(()=>{document.getElementById('app').focus()})

  const memeTimeMs = ({ meme }) => {
    const state = store.getState()
    const { tempo } = state
    const m = state.memes[meme].src
    const lastNote = m?.notes?.slice(-1)?.[0]

    if (m.totalTime) { return m.totalTime * 1000 }
    if (m.totalQuantizedSteps && m?.quantizationInfo?.stepsPerQuarter) {
      const beats = parseInt(m.totalQuantizedSteps) /
        parseInt(m.quantizationInfo.stepsPerQuarter)
      return 1000 * 60 * beats / tempo
    }
    return 1000 * 60 * 8 / tempo // guess we have 8 beats
  }

  const isRecording = () => store.getState().recorder.isRecording
  const thinkingTimeMs = 1500

  const playRec = (e) => {
    // console.log("meme time",memeTimeMs({meme:"target"}))
    stopAll({ doPlayRec: false })
    setRunningPlayRec(true)
    startPlayer({ meme: 'target' })
      .then(() => new Promise((resolve, reject) => {
        if (!isRecording()) {
          btnRecord.current.click()
          setTimeout(() => {
            if (isRecording()) {
              btnStopRecording.current.click()
              resolve(true)
            } else {
              reject('was not recording when tried to stop recording')
            }
          }, memeTimeMs({ meme: 'target' }) + thinkingTimeMs)
        } else {
          reject('was recording when tried to start recording')
        }
      }))
      .catch(err => (err && console.error('playRec error', err)))
      .finally(() => setRunningPlayRec(false))
  }

  const playReview = () => {
    // stopAll({doPlayReview:false})
    setRunningPlayReview(true)
    startPlayer({ meme: 'recording' })
    // .then(()=>console.log("fin target start rec"))
      .then(delay(500))
      .then(() => startPlayer({ meme: 'target' }))
    // .then(()=>console.log("fin rec"))
      .catch(err => err && console.error('playReview error', err))
      .finally(() => { setRunningPlayReview(false) })
  }

  const timedRec = () => {
    stopAll({ doTimedRec: false })
    setRunningTimedRec(true)
    btnRecord.current.click()
    setTimeout(
      () => {
        setRunningTimedRec(false)
        if (isRecording()) {
          btnStopRecording.current.click()
        } else {
          console.error('timedRec: was not recording when tried to stop')
        }
      },
      memeTimeMs({ meme: 'target' }) + thinkingTimeMs
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
  const next = ({ direction = undefined } = {}) => () => {
    // stopAll({doTimedRec:false})
    // stopPlayer()
    const state = store.getState()
    if (!(state.requireMatchForNext) ||
    state?.memes?.target.matchesRecording) {
      playDrumNow(63) // 63 = mid tom, 62 =high, 64 =low, 65=snare
      dispatch(nextMelody({ direction }))
      setTimeout(() => {
        console.log('play next')
        playRec()

        // btnTargetPlay.current.click()
      }, 200)
    } else {
      playDrumNow(65)
    }
  }

  const stopAll = ({
    doPlayRec = true,
    doTimedRec = true,
    doPlayReview = true
  } = {}) => {
    stopPlayer()
    doPlayRec && btnStopRecording.current.click()
    btnTargetStop.current.click()
    btnRecStop.current.click()
    doPlayReview && setRunningPlayReview(false)
    doPlayRec && setRunningPlayRec(false)
    doTimedRec && setRunningTimedRec(false)
  }
  const keyActions = {
    ' ': () => { playRec() },
    Alt: () => { playReview() },
    AltGraph: () => { timedRec() },
    ArrowRight: next({ direction: [1, 0] }),
    ArrowLeft: next({ direction: [-1, 0] }),
    ArrowUp: next({ direction: [0, -1] }),
    ArrowDown: next({ direction: [0, 1] }),
    Escape: stopAll,
    Enter: next({})
  }
  const onKeyDown = (e) => {
    // console.log("key",e.key)
    if (keyActions[e.key]) {
      keyActions[e.key]()
      e.preventDefault()
      return false
    }
  }
  // see https://www.midi.org/forum/1345-help-sysex-yamaha-cp33
  const midiReset = () => {
    WebMidi.outputs.forEach(o => {
      o.stopNote('all')
      o.sendReset()
    })
  }

  const reset = () => {
    console.log('resetting, including midi reset')
    localStorage.removeItem('state')
    midiReset()
    window.location.reload(false)
  }

  // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
  return (
    <div id='app' tabIndex={1} className='app' onKeyDown={onKeyDown}>

      <div className='title'>
        <span id='title'>IMITATION LAB</span>
        <span style={{ float: 'right' }}>
          <Declutter>
            <button
              title='Print app state to browser console'
              onClick={() => console.log(store.getState())}
            >State
            </button>
            <button
              title='Reset application to defaults, reset MIDI, and reload'
              onClick={reset}
            >Reset
            </button>
          </Declutter>
          <button
            title='Reset MIDI'
            onClick={midiReset}
          >MIDI Reset
          </button>
          &nbsp;&nbsp;
          <button
            title='Toggle score type'
            onClick={() => dispatch(actions.toggleScoreType())}
          >Score
          </button>
          <MelodySets />
          <button
            title='Toggle simplified UI'
            onClick={() => {
              try { Tone.start() } catch (e) { console.error('Tone.start() error', e) }
              dispatch(actions.declutter())
            }}
          >{declutter ? 'More...' : '...Less'}
          </button>
        </span>
      </div>

      <Score
        scoreid='target'
        meme='target'
        title=' TARGET'
        hasSave
        hasToWorking={false}
        btnPlay={btnTargetPlay}
        btnStop={btnTargetStop}
      />
      <Recorder {...{
        btnRecord,
        btnStopRecording,
        btnRecPlay,
        btnRecStop
      }}
      />

      <div className='box'>
        {/* <Declutter>CONTROLS &nbsp;&nbsp;</Declutter> */}
        <button
          onClick={playReview}
          style={{ backgroundColor: (runningPlayReview ? 'green' : 'inherit') }}
          title='Play recording, then target for comparison [Alt]'
        >Review Play
        </button>
        <button
          onClick={playRec}
          style={{ backgroundColor: (runningPlayRec ? 'blue' : 'inherit') }}
          title='Play target, then record. [Spacebar] (or sostenuto pedal)'
        >Play Rec
        </button>
        <button
          onClick={timedRec}
          style={{ backgroundColor: (runningTimedRec ? 'red' : 'inherit') }}
          title='Record for the length of TARGET, stopping automatically [AltGr]'
        >Timed Rec
        </button>
        <button
          onClick={next()}
          title='Go to next melody [enter]. Use arrow keys instead to choose direction of purple square on grid below'
        >Next
        </button>
        {/*
      <button onClick={testBtn}>Test</button>
      <button onClick={()=>{ btnTargetStop.current.click() }}>Targ Stop</button>
      <button onClick={()=>{ btnRecPlay.current.click() }}>Rec Play</button>
      <button onClick={()=>{ btnRecStop.current.click() }}>Rec Stop</button>
      <button onClick={()=>{ btnRecord.current.click() }}>REC</button>
      <button onClick={()=>{ btnStopRecording.current.click() }}>REC STOP</button>
      */}

        <Declutter>
          <ValueInput
            size={1}
            label='Tempo'
            title='Tempo for playback and recording [beats per minute]'
            value={tempo}
            change={x => dispatch(actions.tempo(x))}
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
        <div className='box'>
          SOURCES
          <Score scoreid='a' meme='a' title='A' padding='0px' margin='0px' />
          <Score scoreid='b' meme='b' title='B' padding='0px' margin='0px' />
          <Score scoreid='c' meme='c' title='C' padding='0px' margin='0px' />
          <Score scoreid='d' meme='d' title='D' padding='0px' margin='0px' />
        </div>
      </Declutter>

    </div>
  )
}

export default App
