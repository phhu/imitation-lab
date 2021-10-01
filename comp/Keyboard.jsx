import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'

import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import ValueInput from './ValueInput'
import {extraLeft, extraRight, makeNote} from '../utilsMelody'

function Keyboard(props) {
  //const store = useStore()
  const dispatch = useDispatch()
  const firstNote = useSelector(s=>s.keys.first)
  const keyCount = useSelector(s=>s.keys.count)
  const width= useSelector(s=>s.keys.width)
  const lastNote = firstNote + keyCount //MidiNumbers.fromNote('c7');

  console.log("Rendering Keyboard: firstlast",firstNote,lastNote)
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: [
      extraLeft,
      KeyboardShortcuts.BOTTOM_ROW,
      KeyboardShortcuts.QWERTY_ROW,
      extraRight
    ].flat(),
  });

  const notesDown = []

  return (
    <div className="box">
      KEYBOARD
      | Shift <ValueInput value={firstNote} change={(value)=>{
        //console.log("changed value",value,parseInt(value)>40,parseInt(value))
        const x = parseInt(value)
        //if (x>40){
          dispatch(actions.keysFirst(x))
          const note = makeNote(parseInt(x))
          midiPlayer.playNoteDown(note)
          setTimeout(()=>midiPlayer.playNoteUp(note) ,100 )
        //}
      }}/>
      | <span>Caps Lock: +8ve</span>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber) => {
          //console.log("playing",midiNumber,window.midiThru)
          const note = makeNote(midiNumber)
          notesDown.push(note)
          midiPlayer.playNoteDown(note)
        }}
        stopNote={(midiNumber) => {
          //console.log("stopping",midiNumber,midiPlayer)
          notesDown.forEach((note,i,arr)=>{
            if(note.pitch === midiNumber){
              midiPlayer.playNoteUp(note)
              arr.splice(i, 1)
            }
          })
        }}
        width={width}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
}
 

export default Keyboard

