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

import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";
//import {core} from "@magenta/music";
//window.core = core

//window.localMidiInst = require('./comp/LocalMidiInst')
window.melodies = require('./melodies').melodies   // n

window.player = new core.Player()
window.midiPlayer = new core.MIDIPlayer()

window.model = new music_vae.MusicVAE(initialState.src);
window.WebMidi = WebMidi

ReactDOM.render(
  <div id="app" className="app">
    <div className="title">IMITATION LAB</div>
    <hr/>
    <div className="box">
      <div>Loading... Please be patient... 
      (Initializing Google Magenta can take a while)</div>
      <div>Please use Chrome Browser.</div>
      <div>Magenta src: {initialState.src}</div>
    </div>
  </div>, 
  document.getElementById('root')
)
// set up globals before launching app
Promise.all([
  midiPlayer.requestMIDIAccess(),
  window.model.initialize(),   // magenta model
  new Promise((resolve,reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        console.error("WebMidi enable error",err)
        reject(err)
      }
      resolve(WebMidi)
    })
  })
]).then(results => {
  midiPlayer.outputs = midiPlayer.availableOutputs.slice(0,1)   //.slice(0,2)

  window.midiThruIn = WebMidi.inputs[0]
  //window.midiThruOut = WebMidi.outputs[0]

  ReactDOM.render(
    <Provider store={store}>     
      <App />
    </Provider>, 
    document.getElementById('root')
  )
})

