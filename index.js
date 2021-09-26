// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

import App from './App'
var webaudiofont = require('webaudiofont');

//(function(){
  const tone = _tone_0000_JCLive_sf2_file;
  const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextFunc();
  const wafPlayer = new WebAudioFontPlayer();
  wafPlayer.loader.decodeAfterLoading(audioContext, '_tone_0000_JCLive_sf2_file');
//}())

//import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";
const {BLANK} = require('./melodies')
//import {core} from "@magenta/music";
window.melodies = require('./melodies')
window.webMidiPlayer = require('./localMidiInst')
//window.core = core
window.player = new core.Player()
window.recorder = new core.Recorder()
//player.playNote(0,{pitch:40,startTime:0,endTime:1})
//p.playNote(23,{duration:23, pitch:45})

window.midiPlayer = new core.MIDIPlayer()
//window.midiPlayer.outputs = [midiThru]
//midiPlayer.playNoteDown(50)
midiPlayer.requestMIDIAccess().then(() => {
  // For example, use only the first port. If you omit this,
  // a message will be sent to all ports.
  //midiPlayer.outputs = [midiPlayer.availableOutputs[0]]
  midiPlayer.outputs = midiPlayer.availableOutputs.slice(0,2)
  midiPlayer.start(BLANK);
  midiPlayer.playNoteDown({pitch:50})
  ReactDOM.render(<App />, document.getElementById('root'))
  // window.midiThruOut = midiPlayer.availableOutputs[0]
  // window.midiThruIn = midiPlayer.availableOutputs[0]
  // midiThruIn.addEventListener("noteon","all",(e)=>{
  //   //console.log("note on midi input",e)
  //   //midiNoteOff(e.note.number);
  //   var envelope = wafPlayer.queueWaveTable(
  //     audioContext, audioContext.destination, tone, 0, 
  //     e.note.number, 123456789, e.note.velocity / 100
  //   );
  //   midiNotes.push({pitch: e.note.number,envelope });
  // })
  // const midiNoteOff = pitch => midiNotes.forEach((note,i,arr)=>{
  //   if(note.pitch === pitch){
  //     note.envelope.cancel();
  //     arr.splice(i, 1);
  //   }
  // })
  // midiThruIn.addListener("noteoff",1,(e)=>{
  //   //console.log("note off midi input",e)
  //   midiNoteOff(e.note.number);
  // })
})



const src = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small';  // 'data/mel_small'
window.model = new music_vae.MusicVAE(src);
const prepare = Promise.all([
  window.model.initialize()
])



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