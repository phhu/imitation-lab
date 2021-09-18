// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

import App from './funcReact'

//const test = <h1>Hello world! How are you?</h1>

import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";
//import {core} from "@magenta/music";

//window.core = core
window.a = "test"
window.player = new core.Player()
window.recorder = new core.Recorder()
player.playNote(0,{pitch:40,startTime:0,endTime:1})
//p.playNote(23,{duration:23, pitch:45})

WebMidi.enable(function (err) {
  window.WebMidi = WebMidi
  console.log(WebMidi.inputs)
  console.log(WebMidi.outputs)
  window.midiThru = WebMidi.outputs[0]
})

ReactDOM.render(<App />, document.getElementById('root'))



// MIDI.loadPlugin({
//   soundfontUrl: "/path/to/soundfonts/",
//   instrument: "xylophone",
//   callback: function () {
//       var channel = 0, // MIDI allows for 16 channels, 0-15
//           // the xylophone is represented as instrument 13 in General MIDI.
//           instrument = 13,
//           // middle C (C4) according to General MIDI
//           note = 60,
//           velocity = 127, // how hard the note hits, from 0-127
//           delay = 0.5; // how long to hold the note, in seconds
//       // play the note
//       MIDI.programChange(0, instrument); // Load xylophone into Channel 0
//       MIDI.noteOn(0, note, velocity) // Play middle C on Channel 0
//       MIDI.noteOff(0, note, delay) // Release the middle C after 0.5 seconds
//   }
// });