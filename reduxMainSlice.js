/*
import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {change} from './reduxStore'

const someVar = useSelector(s=>s.someVar)
const dispatch = useDispatch(change.someVar(value))
const store = useStore()
const state = store.getState()
*/

import { createSlice } from '@reduxjs/toolkit'
const fp = require('lodash/fp')
import {melodies} from './melodies'
import {removeNonJson,roundToDPs} from './utilsMelody'

export const initialState = { 
  midiOutput: 0,
  tempo: 120,
  localMidiInst: {
    volume: 0.5,
    on: true,
  },
  bars: 2,
  src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
  // src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2',
  keys: {
    first: 47,
    count: 37,
    width: 900,
  },
  memes: { 
    goal: {
      src: melodies.LIBERTANGO_2,
      transpose: 0,
      variationCount: 0,
    },
    initial: {
      src: melodies.TWINKLE_TWINKLE_2,
      transpose: -12,
      variationCount: 0,
    },
    recording: {
      src: melodies.BLANK,
      transpose: 0,
      variationCount: 0,
    },
  },
}

const limit = (min, max) => x => Math.min(Math.max(min,x),max)
const slice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    "tempo": (state,{payload})=>{state.tempo=payload},
    "volume": (state,{payload})=>{state.localMidiInst.volume=limit(0,1)(roundToDPs(2)(payload))},
    "localInstOn": (state,{payload})=>{state.localMidiInst.on=(!!payload)},
    "midiOutput": (state,{payload})=>{state.midiOutput=payload},
    "keysFirst": (state,{payload})=>{
      state.keys.first=limit(12,70)(parseInt(payload))
    },
    "keysWidth": (state,{payload})=>{state.keys.width=payload},
    "memeSrc": (state,{payload})=>{
      state.memes[payload.meme].src=payload.melody
      state.memes[payload.meme].transpose=payload.transpose
      state.memes[payload.meme].variationCount+=1
    },
    "recording": (state,{payload}) => {
      state.memes.recording.src=removeNonJson(payload)
    }
  }
})

//export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions
export const {actions,reducer} = slice
export default slice.reducer