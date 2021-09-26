// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

import App from './App'


//import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";
//import {core} from "@magenta/music";
//window.core = core

window.localMidiInst = require('./localMidiInst')
window.melodies = require('./melodies')
window.player = new core.Player()
window.midiPlayer = new core.MIDIPlayer()

midiPlayer.requestMIDIAccess().then(() => {
  // For example, use only the first port. If you omit this,
  // a message will be sent to all ports.
  //midiPlayer.outputs = [midiPlayer.availableOutputs[0]]
  midiPlayer.outputs = midiPlayer.availableOutputs.slice(0,2)
  //midiPlayer.start(melodies.BLANK);
  //midiPlayer.playNoteDown({pitch:50})
  ReactDOM.render(<App />, document.getElementById('root'))
})

//set up google magenta
const src = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2';
//const src = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small';  // 'data/mel_small'
window.model = new music_vae.MusicVAE(src);
const prepare = Promise.all([
  window.model.initialize()
])


