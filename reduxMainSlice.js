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
import {cloneDeep} from 'lodash'
import {melodies} from './melodies'
import {removeNonJson,roundToDPs,transposeMelody} from './utilsMelody'
import {varyMelody} from './vary'
import {interpolateMelodies} from './interpolate'
import {nextMelody} from './next'

export const initialState = { 
  midiOutput: 0,
  tempo: 120,
  player: {
    playClick: false
  },
  localMidiInst: {
    volume: 0.5,
    on: true,
  },
  recorder: {
    isRecording: false,
    useClick: false,
  },
  bars: 2,
  src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
  //src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2',
  keys: {
    first: 43,
    count: 38,
    width: 900,
  },
  memes: { 
    a: {
      src: cloneDeep(melodies.FRERE_2),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false,
    },
    // initial: {
    //   src: cloneDeep(melodies.TWINKLE_TWINKLE_2T),
    //   transpose: 0,
    //   variationCount: 0,
    // },
    b: {
      src: cloneDeep(melodies.TWINKLE_TWINKLE_2T),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false,
    },
    c: {
      src: cloneDeep(melodies.MELODY1),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false,
    },
    d: {
      src: cloneDeep(melodies.LIBERTANGO_2),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false,
    },
    working: {
      //src: cloneDeep(transposeMelody(-12)(melodies.BASIC_2)),
      src: cloneDeep(melodies.FRERE_2),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false,
    },
    recording: {
      src: cloneDeep(melodies.BLANK),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false,
    },
  },
  melodies: cloneDeep(melodies),
  interpolate: {
    melodies: [],
    isInterpolating: false,
    current: 0,
  },
  history: [],

}

const limit = (min, max) => x => Math.min(Math.max(min,x),max)
const slice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    "tempo": (state,{payload})=>{state.tempo=payload},
    "isRecording": (state,{payload})=>{state.recorder.isRecording=!!payload},
    "useClick": (state,{payload})=>{state.recorder.useClick=!!payload},
    "playClick": (state,{payload})=>{state.player.playClick=!!payload},
    "noteJustPlayed": (state,{payload})=>{state.recorder.noteJustPlayed=!!payload},
    "volume": (state,{payload})=>{state.localMidiInst.volume=limit(0,1)(roundToDPs(2)(payload))},
    "localInstOn": (state,{payload})=>{state.localMidiInst.on=(!!payload)},
    "midiOutput": (state,{payload})=>{state.midiOutput=payload},
    "keysFirst": (state,{payload})=>{
      state.keys.first=limit(12,70)(parseInt(payload))
    },
    "keysWidth": (state,{payload})=>{state.keys.width=payload},
    "memeSrc": (state,{payload})=>{
      const m = state.memes[payload.meme]
      m.src=payload.melody
      m.transpose=payload.transpose
      m.variationCount=
        (payload.resetVarationCount?0:m.variationCount) +
        (payload.incVariationCount?1:0)
      m.matchesRecording=null  //null=unknown
    },  
    "recording": (state,{payload}) => {
      const {recording, matches=[]} = payload
      if (recording){
        state.memes.recording.src=removeNonJson(recording)
      }
      Object.entries(matches).forEach(
        ([key,val]) => {state.memes[key].matchesRecording = val} 
      )
    }
  },
  extraReducers: (builder) => {builder
    .addCase(varyMelody.pending, (state, {meta,payload,type}) => {
      //console.log("got varyMelody.pending")
      const m = state.memes[meta.arg.meme]
      m.isVarying = true
    })
    .addCase(varyMelody.fulfilled, (state, {meta,payload,type}) => {
      const m = state.memes[meta.arg.meme]
      const {key,title} = meta.arg.melody
      m.src={title, key, ...payload}
      m.transpose=0
      m.variationCount+=1
      m.matchesRecording=null  //null=unknown
      m.isVarying = false
    })
    .addCase(varyMelody.rejected, (state, action) => {
      console.error("varyMelody rejected",action)
    })
    .addCase(interpolateMelodies.pending, (state, {meta,payload,type}) => {
      //console.log("got interpolateMelodies.pending")
      state.interpolate.isInterpolating = true
    })
    .addCase(interpolateMelodies.fulfilled, (state, {meta,payload,type}) => {
      //console.log("got interpolateMelodies.fulfilled")
      const i = state.interpolate
      i.melodies = payload
      i.current = 0
      i.isInterpolating = false
    })
    .addCase(interpolateMelodies.rejected, (state, action) => {
      console.error("interpolateMelodies rejected",action)
      state.interpolate.isInterpolating = false
    })
    .addCase(nextMelody.pending, (state, {meta,payload,type}) => {
      //console.log("got nextMelody.pending")
    })
    .addCase(nextMelody.fulfilled, (state, {meta,payload,type}) => {
      //console.log("got nextMelody.fulfilled")
      const {nextMelody, newCurrent} = payload
      const {key,title} = state.memes['working']
      const m = state.memes['working']
      m.src={title, key, ...nextMelody}
      m.transpose=0
      m.variationCount=0
      m.matchesRecording=null  //null=unknown
      m.isVarying = false
      if (newCurrent || newCurrent==0){
        state.interpolate.current = newCurrent
      }
    })
    .addCase(nextMelody.rejected, (state, action) => {
      console.error("nextMelody rejected",action)
    })
  },
})

//export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions
export const {actions,reducer} = slice
export default slice.reducer