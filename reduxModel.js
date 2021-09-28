/*
import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {change} from './reduxStore'

const someVar = useSelector(s=>s.someVar)
const dispatch = useDispatch(change.someVar(value))
const store = useStore()
const state = store.getState()
*/
const fp = require('lodash/fp')
import melodies from './melodies'

export const preloadedState = { 
  tempo: 120,
  bars: 2,
  src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
  // src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2',

  keys: {
    first: 40,
    count: 37,
    width: 900,
  },
  memes: { 
    goal: {
      src: melodies.LIBERTANGO_2,
      transpose: 0,
    },
    initial: {
      src: melodies.TWINKLE_TWINKLE_2,
      transpose: -12,
    }
  },
}

//const actn = (pathFn) => (state,{payload}) => { pathFn(state)=payload }
const limit = (min, max) => x => Math.min(Math.max(min,x),max)
//(state,{payload})
export const actions = {
  "tempo": (state,{payload})=>{state.tempo=payload},
  "keysFirst": (state,{payload})=>{
    state.keys.first=limit(12,70)(parseInt(payload))
  },
  "keysWidth": (state,{payload})=>{state.keys.width=payload},
  "memeSrc": (state,{payload})=>{
    state.memes[payload.meme].src=payload.melody
    state.memes[payload.meme].transpose=payload.transpose
  }
}