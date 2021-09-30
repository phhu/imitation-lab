// index.js
// needed to get async to work with parcel 
// see https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import 'regenerator-runtime/runtime'   
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

import App from './App'
import {Provider,useSelector, useStore} from 'react-redux'
import {store} from './reduxStore'
import {initialState} from './reduxMainSlice'

import fp from 'lodash/fp'

//import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";
//import {core} from "@magenta/music";
//window.core = core

//window.localMidiInst = require('./comp/LocalMidiInst')
window.melodies = require('./melodies').melodies

window.player = new core.Player()
window.midiPlayer = new core.MIDIPlayer()

window.model = new music_vae.MusicVAE(initialState.src);

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

