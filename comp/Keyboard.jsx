import React, { useState, useEffect } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import ValueInput from './ValueInput'

function Keyboard(props) {
  const [firstNote, setFirstNote] = useState(40)
  //const firstNote = 50 //MidiNumbers.fromNote('c3');
  const lastNote = firstNote + 37 //MidiNumbers.fromNote('c7');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: [{
      natural: '\\',
      flat: '',
      sharp: 'a]'
    },KeyboardShortcuts.BOTTOM_ROW,KeyboardShortcuts.QWERTY_ROW,{
      natural: ']',
      flat: '=',
      sharp: ''
    }].flat(),
  });
  const player = new core.Player()
  
  const notes = []
  const makeNote = midiNumber =>({pitch:midiNumber,velocity:50,startTime:0,endTime:0})
  return (
    <div>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber) => {
          // Play a given note - see notes below
          //console.log("playing",midiNumber,window.midiThru)
          //player.seekTo(0)
          const note = makeNote(midiNumber)
          notes.push(note)
          midiPlayer.playNoteDown(note)
          //window.midiThru.playNote(midiNumber)
          //let o = WebMidi.outputs[0]
          //player.playNote(0,{pitch:midiNumber,startTime:0,endTime:1})
        }}
        stopNote={(midiNumber) => {
          // Stop playing a given note - see notes below
          //console.log("stopping",midiNumber,midiPlayer)
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
        width={900}
        keyboardShortcuts={keyboardShortcuts}
      />
      <ValueInput initial="40" change={(value)=>{
        console.log("changed value",value,parseInt(value)>40,parseInt(value))
        if (parseInt(value)>40){
          setFirstNote(parseInt(value))
          const note = makeNote(parseInt(value))
          midiPlayer.playNoteDown(note)
          setTimeout(()=>midiPlayer.playNoteUp(note) ,100 )
        }
      }}/>
    </div>
  );
}
 

export default Keyboard

