// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

import App from './App'
import {Provider,useSelector, useStore} from 'react-redux'
import {store} from './reduxStore'
import {preloadedState} from './reduxModel'

import fp from 'lodash/fp'

//import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";
//import {core} from "@magenta/music";
//window.core = core

window.localMidiInst = require('./localMidiInst')
window.melodies = require('./melodies')

window.player = new core.Player()
window.midiPlayer = new core.MIDIPlayer()

window.model = new music_vae.MusicVAE(preloadedState.src);

Promise.all([
  midiPlayer.requestMIDIAccess(),
  window.model.initialize(),
]).then(results => {
  midiPlayer.outputs = midiPlayer.availableOutputs.slice(0,2)
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, 
    document.getElementById('root')
  )
})

