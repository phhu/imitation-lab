import React, { useState, useEffect } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

function Keyboard() {
  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('c7');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: [KeyboardShortcuts.BOTTOM_ROW,KeyboardShortcuts.QWERTY_ROW].flat(),
  });
  const player = new core.Player()
  
  const notes = []

  return (
    <Piano
      noteRange={{ first: firstNote, last: lastNote }}
      playNote={(midiNumber) => {
        // Play a given note - see notes below
        console.log("playing",midiNumber,window.midiThru)
        //player.seekTo(0)
        const note = {pitch:midiNumber,velocity:50,startTime:0,endTime:0}
        notes.push(note)
        midiPlayer.playNoteDown(note)
        //window.midiThru.playNote(midiNumber)
        //let o = WebMidi.outputs[0]
        //player.playNote(0,{pitch:midiNumber,startTime:0,endTime:1})
      }}
      stopNote={(midiNumber) => {
        // Stop playing a given note - see notes below
        console.log("stopping",midiNumber,midiPlayer)
        notes.forEach((note,i,arr)=>{
          if(note.pitch === midiNumber){
            midiPlayer.playNoteUp(note)
            arr.splice(i, 1)
          }
        }
      )

        midiPlayer.playNoteUp({pitch:midiNumber,velocity:50,startTime:0,endTime:0})
        //window.midiThru.stopNote(midiNumber)
      }}
      width={1000}
      keyboardShortcuts={keyboardShortcuts}
    />
  );
}
 

export default Keyboard

