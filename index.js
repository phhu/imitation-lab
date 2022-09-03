// index.js
// needed to get async to work with parcel
// see https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

import App from './App'
import { Provider, useSelector, useStore } from 'react-redux'
import { store } from './reduxStore'
import { initialState } from './reduxMainSlice'

import fp from 'lodash/fp'

import WebMidi, { InputEventNoteon, InputEventNoteoff } from 'webmidi'
// import {core} from "@magenta/music";
// window.core = core

// window.localMidiInst = require('./comp/LocalMidiInst')
window.melodies = require('./melodies').melodies // n

window.player = new core.Player()
window.midiPlayer = new core.MIDIPlayer()

window.model = new music_vae.MusicVAE(initialState.src)
window.WebMidi = WebMidi

ReactDOM.render(
  <div id='app' className='app'>
    <div className='title'><span id='title'>IMITATION LAB</span></div>
    <hr />
    <div className='box'>Loading... Please be patient... </div>
    <div className='box'>

      <div>(Initializing Google Magenta can take a while)</div>
      <div>Magenta src: {initialState.src}</div>
      <div>Use
        <a href={location.href.replace(/^(.*?)(\#.*)?$/, '$1') + '#basic'}>{location.href.replace(/^(.*?)(\#.*)?$/, '$1') + '#basic'}
        </a> for smaller model (faster load)
      </div>
      <div>Use
        <a href={location.href.replace(/^(.*?)(\#.*)?$/, '$1') + ''}>{location.href.replace(/^(.*?)(\#.*)?$/, '$1') + ''}
        </a> for regular model (slower load)
      </div>
    </div>
    <div className='box'>Note that this application may not functional fully without a suitable MIDI driver.
      If you don't have one you could try <a href='https://jazz-soft.net/'>https://jazz-soft.net/</a>
    </div>
    <div className='box'>Please use Chrome Browser.</div>
  </div>,
  document.getElementById('root')
)
// set up globals before launching app
Promise.all([
  midiPlayer.requestMIDIAccess(),
  window.model.initialize(), // magenta model
  new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        console.error('WebMidi enable error', err)
        reject(err)
      }
      resolve(WebMidi)
    })
  })
]).then(results => {
  midiPlayer.outputChannel = 1
  midiPlayer.outputs = midiPlayer.availableOutputs.slice(0, 2) // .slice(0,2)

  window.midiThruIn = WebMidi.inputs[0]
  // window.midiThruOut = WebMidi.outputs[0]

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
})
