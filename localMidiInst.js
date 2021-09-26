import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi";

var webaudiofont = require('webaudiofont');

const tone = _tone_0000_JCLive_sf2_file;
const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextFunc();
const wafPlayer = new WebAudioFontPlayer();
wafPlayer.loader.decodeAfterLoading(audioContext, '_tone_0000_JCLive_sf2_file');

const midiNotes = []
WebMidi.enable(function (err) {
  if (err) console.error("WebMidi error",err)
  //window.WebMidi = WebMidi
  console.log("inputs",WebMidi.inputs)
  console.log("outputs",WebMidi.outputs)
  const midiThruIn = WebMidi.inputs[0]
  //const midiThruOut = WebMidi.outputs[0]

  midiThruIn.addListener("noteon","all",(e)=>{
    //console.log("*localMidiInst note on",e)
    //midiNoteOff(e.note.number);
    var envelope = wafPlayer.queueWaveTable(
      audioContext, audioContext.destination, tone, 0, 
      e.note.number, 999999, 1    // 123456789     e.note.velocity / 2000000
    );
    midiNotes.push({pitch: e.note.number,envelope });
  })
  const {cancelNote} = require('./utils')

  const midiNoteOff = pitch => midiNotes.forEach(cancelNote(pitch))
  midiThruIn.addListener("noteoff",1,(e)=>{
    //console.log("*localMidiInst note on",e)
    midiNoteOff(e.note.number);
  })
})

module.exports = WebMidi 