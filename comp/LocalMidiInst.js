import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi"
import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import ValueInput from './ValueInput'
import Checkbox from './Checkbox'   // http://react.tips/checkboxes-in-react-16/
const {cancelNote} = require('../utils')
var webaudiofont = require('webaudiofont');

const tone = _tone_0000_JCLive_sf2_file;
const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextFunc();
const wafPlayer = new WebAudioFontPlayer();
wafPlayer.loader.decodeAfterLoading(audioContext, '_tone_0000_JCLive_sf2_file');

export default function LocalMidiInst(props){

  const midiNotes = []
  const store = useStore()
  const dispatch = useDispatch()
  const volume = useSelector(s=>s.localMidiInst.volume ?? 0.5)
  const isOn = useSelector(s=>s.localMidiInst.on ?? true)
  useEffect(()=>{
    // WebMidi.enable(function (err) {
    //   if (err) console.error("WebMidi error",err)
    //   //window.WebMidi = WebMidi
    //   //console.log("inputs",WebMidi.inputs)
    //   //console.log("outputs",WebMidi.outputs)
    //   const midiThruIn = WebMidi.inputs[0]
    //   //const midiThruOut = WebMidi.outputs[0]

      midiThruIn.addListener("noteon","all",(e)=>{
        //console.log("*localMidiInst note on",e)
        /*  see https://github.com/surikov/webaudiofont
        audioContext - AudioContext
        target - a node to connect to, for example audioContext.destination
        preset - variable with the instrument preset
        when - when to play, audioContext.currentTime or 0 to play now, audioContext.currentTime + 3 to play after 3 seconds
        pitch - note pitch from 0 to 127, for example 2+12*4 to play D of fourth octave (use MIDI key for drums)
        duration - note duration in seconds, for example 4 to play 4 seconds
        volume - 0.0 <=1.0 volume (0 is 'no value', 'no value' is 1)
        slides - array of pitch bends
        */
        const {volume, on} = store.getState().localMidiInst
        if(on){
          var envelope = wafPlayer.queueWaveTable(
            audioContext, 
            audioContext.destination,   //target
            tone,             // preset
            0,                // when 
            e.note.number,    //pitch
            9999,           // duration
            volume           //volume // 123456789     e.note.velocity / 2000000
          );
          midiNotes.push({pitch: e.note.number,envelope });
        }
      })

      const midiNoteOff = pitch => midiNotes.forEach(cancelNote(pitch))
      midiThruIn.addListener("noteoff",1,(e)=>{
        const {volume, on} = store.getState().localMidiInst
        if (on){
        //console.log("*localMidiInst note off",e)
          midiNoteOff(e.note.number)
        }
      })
    //})
  })
  return <div>
    LOCALMIDIINST | 
    <ValueInput 
      title="Volume" 
      value={volume} 
      step="0.1"
      change={ x=>dispatch(actions.volume(x)) } 
    /> | 
    <Checkbox  
      label="on"
      checked={isOn}
      onChange={ e=>dispatch(actions.localInstOn(e.target.checked))  }
    />
  </div>
}

export {WebMidi} 