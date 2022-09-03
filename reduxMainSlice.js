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
import { cloneDeep, zipWith } from 'lodash'
import { melodies } from './melodies'
import { removeNonJson, roundToDPs, limit } from './utilsMelody'
import { varyMelody } from './vary'
import { interpolateMelodies } from './interpolate'
import { nextMelody } from './next'
import { sequencesIdentical } from './compare'
const fp = require('lodash/fp')

export const initialState = {
  midiOutput: 0,
  tempo: 100,
  declutter: true,
  scoreType: 1,
  requireMatchForNext: false,
  player: {
    playClick: false
  },
  localMidiInst: {
    volume: 0.5,
    on: true
  },
  recorder: {
    isRecording: false,
    useClick: false
  },
  bars: 2,
  // src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
  // src: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2',
  src: location?.hash === '#basic'
    ? 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small'
    : 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2',
  keys: {
    first: 43,
    count: 38,
    width: 900
  },
  memes: {
    a: {
      src: cloneDeep(melodies.FRERE_2),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false
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
      isCollapsed: false
    },
    c: {
      src: cloneDeep(melodies.LICK),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false
    },
    d: {
      src: cloneDeep(melodies.LIBERTANGO_2),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false
    },
    target: {
      // src: cloneDeep(transposeMelody(-12)(melodies.BASIC_2)),
      src: cloneDeep(melodies.FRERE_2),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false
    },
    recording: {
      src: cloneDeep(melodies.BLANK),
      transpose: 0,
      variationCount: 0,
      isCollapsed: false
    }
  },
  melodies: cloneDeep(melodies),
  melodySets: {
    current: 'test',
    sets: [
      { name: 'test', melodies: ['FRERE_2', 'LICK', 'UNDER_PRESSURE', 'TWINKLE_TWINKLE_2T'] },
      { name: 'test2', melodies: ['LIBERTANGO_2', 'BASIC_2', 'UNDER_PRESSURE', 'TWINKLE_TWINKLE_2T'] },
      {
        name: 'Dark Horse',
        melodies: ['JOYFUL_NOISE', 'DARK_HORSE', 'GO_DOWN_MOSES', 'GODZILLA']
      },
      {
        name: 'Dark Horse2',
        melodies: ['JOYFUL_NOISE', 'DARK_HORSE', 'MOMENTS_IN_LOVE', 'WHY_IM_HOT']
      },
      {
        name: 'Dark Horse3',
        melodies: ['JOYFUL_NOISE', 'DARK_HORSE', 'MOMENTS_IN_LOVE_2', 'WHY_IM_HOT_2']
      },
      {
        name: 'Dark Horse vs Mozart',
        melodies: ['DARK_HORSE', 'MOZART1', 'MOMENTS_IN_LOVE_2', 'MOZART4']
      },
      {
        name: 'Mozart Sonata in C 1',
        melodies: ['MOZART1', 'MOZART2', 'MOZART3', 'MOZART4']
      },
      {
        name: 'Mozart Sonata in C 2',
        melodies: ['MOZART1', 'MOZART2', 'MOZART3', 'MOZART5']
      },
      {
        name: 'Mozart Sonata in C 3',
        melodies: ['MOZART1', 'MOZART2', 'MOZART3', 'MOZART6']
      },
      {
        name: 'Experiment 1',
        melodies: ['TWINKLE_TWINKLE_2T', 'MOZART1', 'UNDER_PRESSURE', 'MOMENTS_IN_LOVE_2']
      },
      {
        name: 'Experiment 2',
        melodies: ['LICK', 'MOZART3', 'GODZILLA', 'LIBERTANGO_2']
      }
    ]
  },
  interpolate: {
    melodies: [],
    matches: [],
    currentMatches: [],
    isInterpolating: false,
    current: 0,
    direction: [1, 0]
  },
  history: []

}

const slice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    tempo: (state, { payload }) => { state.tempo = payload },
    isRecording: (state, { payload }) => { state.recorder.isRecording = !!payload },
    isInterpolating: (state, { payload }) => { state.interpolate.isInterpolating = !!payload },
    isPlaying: (state, { payload }) => {
      state.memes[payload.meme].isPlaying = !!(payload?.value)
    },
    toggleScoreType: (state, { payload }) => {
      state.scoreType = limit(0, 2)((payload ?? state.scoreType + 1) % 3)
    },
    useClick: (state, { payload }) => { state.recorder.useClick = !!payload },
    playClick: (state, { payload }) => { state.player.playClick = !!payload },
    noteJustPlayed: (state, { payload }) => { state.recorder.noteJustPlayed = !!payload },
    volume: (state, { payload }) => { state.localMidiInst.volume = limit(0, 1)(roundToDPs(2)(payload)) },
    localInstOn: (state, { payload }) => { state.localMidiInst.on = (!!payload) },
    midiOutput: (state, { payload }) => { state.midiOutput = payload },
    keysFirst: (state, { payload }) => {
      state.keys.first = limit(12, 70)(parseInt(payload))
    },
    keysWidth: (state, { payload }) => { state.keys.width = payload },
    declutter: (state, { payload }) => {
      // console.log("declutter",payload)
      state.declutter = !(state.declutter)
    },
    saveMelody: (state, { payload }) => {
      // console.log("saveMelody",payload)
      const { meme, name = 'saved' } = payload
      const melody = meme ? (state?.memes?.[meme]?.src) : removeNonJson(payload.melody)
      melody.title = name
      melody.key = name
      state.melodies[name] = melody
    },
    memeToWorking: (state, { payload }) => {
      // console.log("memeToWorking",payload)
      if (state?.memes[payload]) {
        state.memes.target = state.memes[payload]
        const newCurrent = state?.interpolate?.melodies?.findIndex(m =>
          sequencesIdentical(m, state.memes[payload].src)
        )
        if (newCurrent > -1 && newCurrent != undefined) {
          state.interpolate.current = newCurrent
        }
      }
    },
    melodyToWorking: (state, { payload }) => {
      // console.log("melodyToWorking",payload)
      const { melody, newCurrent } = payload
      if (melody?.notes) {
        const m = state.memes.target
        m.src = melody
        m.transpose = 0
        m.variationCount += 1
        m.matchesRecording = null // null=unknown
        m.isVarying = false
      }
      if (newCurrent !== undefined) {
        state.interpolate.current = limit(0, state.interpolate.melodies.length)(parseInt(newCurrent))
      }
    },
    memeSrc: (state, { payload }) => {
      // console.log("memeSrc",payload)
      const m = state.memes[payload.meme]
      m.src = payload.melody
      m.transpose = payload.transpose
      m.variationCount =
        (payload.resetVarationCount ? 0 : m.variationCount) +
        (payload.incVariationCount ? 1 : 0)
      m.matchesRecording = null // null=unknown
    },
    recording: (state, { payload }) => {
      // console.log("setting recording",payload)
      const { recording, matches = {}, interpolationMatches } = payload
      if (recording) {
        state.memes.recording.src = removeNonJson(recording)
      }
      Object.entries(matches).forEach(
        ([key, val]) => { state.memes[key].matchesRecording = val }
      )
      if (interpolationMatches && interpolationMatches?.length > 0) {
        state.interpolate.currentMatches = interpolationMatches
        state.interpolate.matches = zipWith(
          state.interpolate.matches,
          interpolationMatches,
          (a, b) => a || b
        )
      }
    },
    changeMelodySet: (state, { payload }) => {
      if (state?.melodySets?.sets?.some(
        ms => ms.name === payload
      )) {
        state.melodySets.current = payload

        const newSetIndex = state?.melodySets?.sets.findIndex(
          s => s.name === payload
        )
        const { melodies } = state?.melodySets?.sets[newSetIndex]
        const keys = ['a', 'b', 'c', 'd']
        // console.log("changeMelodySet",payload,{newSetIndex,melodies})
        keys.forEach((key, i) => {
          if (state.melodies[melodies[i]]) { // check melody exists
            state.memes[key].src = state.melodies[melodies[i]]
          }
        })
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(varyMelody.pending, (state, { meta, payload, type }) => {
      // console.log("got varyMelody.pending")
        const m = state.memes[meta.arg.meme]
        m.isVarying = true
      })
      .addCase(varyMelody.fulfilled, (state, { meta, payload, type }) => {
        const m = state.memes[meta.arg.meme]
        const { key, title } = meta.arg.melody
        m.src = { title, key, ...payload }
        m.transpose = 0
        m.variationCount += 1
        m.matchesRecording = null // null=unknown
        m.isVarying = false
      })
      .addCase(varyMelody.rejected, (state, action) => {
        console.error('varyMelody rejected', action)
      })
      .addCase(interpolateMelodies.pending, (state, { meta, payload, type }) => {
      // console.log("got interpolateMelodies.pending")
        state.interpolate.isInterpolating = true
      })
      .addCase(interpolateMelodies.fulfilled, (state, { meta, payload, type }) => {
      // console.log("got interpolateMelodies.fulfilled")
        const i = state.interpolate
        i.melodies = payload
        i.current = 0
        i.isInterpolating = false
        i.matches = []
        i.currentMatches = []

        if (i.melodies?.[0]?.notes) {
          const { target } = state.memes
          target.src = i.melodies?.[0]
          target.transpose = 0
          target.variationCount = 0
          target.matchesRecording = null // null=unknown
          target.isVarying = false
        }
      })
      .addCase(interpolateMelodies.rejected, (state, action) => {
        console.error('interpolateMelodies rejected', action)
        state.interpolate.isInterpolating = false
      })
      .addCase(nextMelody.pending, (state, { meta, payload, type }) => {
      // console.log("got nextMelody.pending")
      })
      .addCase(nextMelody.fulfilled, (state, { meta, payload, type }) => {
      // console.log("got nextMelody.fulfilled")
        const { nextMelody, newCurrent, direction } = payload
        const { key, title } = state.memes.target
        const target = state.memes.target
        target.src = { title, key, ...nextMelody }
        target.transpose = 0
        target.variationCount = 0
        target.matchesRecording = null // null=unknown
        target.isVarying = false
        if (newCurrent || newCurrent == 0) {
          state.interpolate.current = newCurrent
        }
        if (direction) {
          state.interpolate.direction = direction
        }
      })
      .addCase(nextMelody.rejected, (state, action) => {
        console.error('nextMelody rejected', action)
      })
  }
})

// export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions
export const { actions, reducer } = slice
export default slice.reducer
