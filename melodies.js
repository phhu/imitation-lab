import {mapValues} from 'lodash'
import {transposeMelody} from './utilsMelody'

const everyNote = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B,'.repeat(20).split(',').map( function(x,i) {
  return x + '' + Math.floor(i/12);
});

//returns the midi pitch value for the given note.
//returns -1 if not found
const toMidi = (note) => everyNote.indexOf(note);
const s = 16

let lastStart = 0
const nd = spec => {
  spec.start ??= lastStart + spec.dur
  lastStart = spec.start
  return ({...spec,
    quantizedEndStep:spec.start+spec.dur,
    quantizedStartStep:spec.start,
    pitch: spec.pitch || toMidi(spec.note)
  })
}

const melodiesInt = {
  NONE: { 
    title: "None",
    totalQuantizedSteps: 16,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
    ]
  },
  BLANK: { 
    title: "Blank",
    totalQuantizedSteps: 16,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      nd({pitch: 60, start: 0, dur: 4}),
    ]
  },
  BASIC: { 
    title: "Basic",
    totalQuantizedSteps: 64,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      nd({pitch: 60, start: 0, dur: 16}),
      nd({pitch: 60, start: 16, dur: 16}),
      nd({pitch: 60, start: 32, dur: 16}),
      nd({pitch: 60, start: 48, dur: 16}),
    ]
  },
  BASIC_2: { 
    title: "Basic_2",
    totalQuantizedSteps: 32,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      nd({pitch: 60, start: 0, dur: 8}),
      nd({pitch: 60, start: 8, dur: 8}),
      nd({pitch: 60, start: 16, dur:8}),
      nd({pitch: 60, start: 24, dur:8}),
    ]
  },
  FRERE_2: { 
    totalQuantizedSteps: 32,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      nd({pitch: 48, start: 0, dur: 4}),
      nd({pitch: 50, dur: 4}),
      nd({pitch: 52, dur:4}),
      nd({pitch: 48,  dur:4}),
      nd({pitch: 48, dur: 4}),
      nd({pitch: 50, dur: 4}),
      nd({pitch: 52, dur:4}),
      nd({pitch: 48,  dur:4}),
    ]
  },
  MELODY1: { 
    title:"Lick",
    totalQuantizedSteps: 32,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      {pitch: toMidi('A3'), quantizedStartStep: 0, quantizedEndStep: 4},
      {pitch: toMidi('D4'), quantizedStartStep: 4, quantizedEndStep: 6},
      {pitch: toMidi('E4'), quantizedStartStep: 6, quantizedEndStep: 8},
      {pitch: toMidi('F4'), quantizedStartStep: 8, quantizedEndStep: 10},
      {pitch: toMidi('D4'), quantizedStartStep: 10, quantizedEndStep: 12},
      {pitch: toMidi('E4'), quantizedStartStep: 12, quantizedEndStep: 16},
      {pitch: toMidi('C4'), quantizedStartStep: 16, quantizedEndStep: 20},
      {pitch: toMidi('D4'), quantizedStartStep: 20, quantizedEndStep: 26},
      {pitch: toMidi('A3'), quantizedStartStep: 26, quantizedEndStep: 28},
      {pitch: toMidi('A3'), quantizedStartStep: 28, quantizedEndStep: 32}
    ]
  },
  TWINKLE_TWINKLE: {
    title:"Twinkle Twinkle",
    totalQuantizedSteps: 64,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2},
      {pitch: 60, quantizedStartStep: 2, quantizedEndStep: 4},
      {pitch: 67, quantizedStartStep: 4, quantizedEndStep: 6},
      {pitch: 67, quantizedStartStep: 6, quantizedEndStep: 8},
      {pitch: 69, quantizedStartStep: 8, quantizedEndStep: 10},
      {pitch: 69, quantizedStartStep: 10, quantizedEndStep: 12},
      {pitch: 67, quantizedStartStep: 12, quantizedEndStep: 16},

      {pitch: 65, quantizedStartStep: 16, quantizedEndStep: 18},
      {pitch: 65, quantizedStartStep: 18, quantizedEndStep: 20},
      {pitch: 64, quantizedStartStep: 20, quantizedEndStep: 22},
      {pitch: 64, quantizedStartStep: 22, quantizedEndStep: 24},
      {pitch: 62, quantizedStartStep: 24, quantizedEndStep: 26},
      {pitch: 62, quantizedStartStep: 26, quantizedEndStep: 28},
      {pitch: 60, quantizedStartStep: 28, quantizedEndStep: 32},  

      nd({note: 'G5', start: 32, dur: 2}),
      nd({note: 'G5', start: 34, dur: 2}),
      nd({note: 'F5', start: 36, dur: 2}),
      nd({note: 'F5', start: 38, dur: 2}),
      nd({note: 'E5', start: 40, dur: 2}),
      nd({note: 'E5', start: 42, dur: 2}),
      nd({note: 'D5', start: 44, dur: 4}),

      nd({note: 'G5', start: 48, dur: 2}),
      nd({note: 'G5', start: 50, dur: 2}),
      nd({note: 'F5', start: 52, dur: 2}),
      nd({note: 'F5', start: 54, dur: 2}),
      nd({note: 'E5', start: 56, dur: 2}),
      nd({note: 'E5', start: 58, dur: 2}),
      nd({note: 'D5', start: 60, dur: 4}),
    ],
  },
  TWINKLE_TWINKLE_2: {
    title:"Twinkle Twinkle 2",
    totalQuantizedSteps: 32,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2},
      {pitch: 60, quantizedStartStep: 2, quantizedEndStep: 4},
      {pitch: 67, quantizedStartStep: 4, quantizedEndStep: 6},
      {pitch: 67, quantizedStartStep: 6, quantizedEndStep: 8},
      {pitch: 69, quantizedStartStep: 8, quantizedEndStep: 10},
      {pitch: 69, quantizedStartStep: 10, quantizedEndStep: 12},
      {pitch: 67, quantizedStartStep: 12, quantizedEndStep: 16},

      {pitch: 65, quantizedStartStep: 16, quantizedEndStep: 18},
      {pitch: 65, quantizedStartStep: 18, quantizedEndStep: 20},
      {pitch: 64, quantizedStartStep: 20, quantizedEndStep: 22},
      {pitch: 64, quantizedStartStep: 22, quantizedEndStep: 24},
      {pitch: 62, quantizedStartStep: 24, quantizedEndStep: 26},
      {pitch: 62, quantizedStartStep: 26, quantizedEndStep: 28},
      {pitch: 60, quantizedStartStep: 28, quantizedEndStep: 32},  

    ],
  },
  LIBERTANGO_2: { 
    title: "Libertango 2",
    totalQuantizedSteps: 32,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      {pitch: toMidi('E4'), quantizedStartStep: 2, quantizedEndStep: 4},
      {pitch: toMidi('F4'), quantizedStartStep: 4, quantizedEndStep: 6},
      {pitch: toMidi('E4'), quantizedStartStep: 6, quantizedEndStep: 8},
      {pitch: toMidi('F4'), quantizedStartStep: 8, quantizedEndStep: 10},
      {pitch: toMidi('E4'), quantizedStartStep: 10, quantizedEndStep: 12},
      {pitch: toMidi('C5'), quantizedStartStep: 12, quantizedEndStep: 14},
      {pitch: toMidi('A4'), quantizedStartStep: 14, quantizedEndStep: 16},

      {pitch: toMidi('E4'), quantizedStartStep: 1*s+2, quantizedEndStep: 1*s+4},
      {pitch: toMidi('F4'), quantizedStartStep: 1*s+4, quantizedEndStep: 1*s+6},
      {pitch: toMidi('E4'), quantizedStartStep: 1*s+6, quantizedEndStep: 1*s+8},
      {pitch: toMidi('C5'), quantizedStartStep: 1*s+8, quantizedEndStep: 1*s+10},
      {pitch: toMidi('A4'), quantizedStartStep: 1*s+10, quantizedEndStep: 1*s+12},
      {pitch: toMidi('E4'), quantizedStartStep: 1*s+12, quantizedEndStep: 1*s+14},
      {pitch: toMidi('F4'), quantizedStartStep: 1*s+14, quantizedEndStep: 1*s+16},
    ]
  },
  LIBERTANGO: { 
    title: "Libertango",
    totalQuantizedSteps: 64,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      {pitch: toMidi('E4'), quantizedStartStep: 2, quantizedEndStep: 4},
      {pitch: toMidi('F4'), quantizedStartStep: 4, quantizedEndStep: 6},
      {pitch: toMidi('E4'), quantizedStartStep: 6, quantizedEndStep: 8},
      {pitch: toMidi('F4'), quantizedStartStep: 8, quantizedEndStep: 10},
      {pitch: toMidi('E4'), quantizedStartStep: 10, quantizedEndStep: 12},
      {pitch: toMidi('C5'), quantizedStartStep: 12, quantizedEndStep: 14},
      {pitch: toMidi('A4'), quantizedStartStep: 14, quantizedEndStep: 16},

      {pitch: toMidi('E4'), quantizedStartStep: 1*s+2, quantizedEndStep: 1*s+4},
      {pitch: toMidi('F4'), quantizedStartStep: 1*s+4, quantizedEndStep: 1*s+6},
      {pitch: toMidi('E4'), quantizedStartStep: 1*s+6, quantizedEndStep: 1*s+8},
      {pitch: toMidi('C5'), quantizedStartStep: 1*s+8, quantizedEndStep: 1*s+10},
      {pitch: toMidi('A4'), quantizedStartStep: 1*s+10, quantizedEndStep: 1*s+12},
      {pitch: toMidi('E4'), quantizedStartStep: 1*s+12, quantizedEndStep: 1*s+14},
      {pitch: toMidi('F4'), quantizedStartStep: 1*s+14, quantizedEndStep: 1*s+16},

      {pitch: toMidi('D#4'), quantizedStartStep: 2*s+2, quantizedEndStep: 2*s+4},
      {pitch: toMidi('E4'), quantizedStartStep: 2*s+4, quantizedEndStep: 2*s+6},
      {pitch: toMidi('D#4'), quantizedStartStep: 2*s+6, quantizedEndStep: 2*s+8},
      {pitch: toMidi('E4'), quantizedStartStep: 2*s+8, quantizedEndStep: 2*s+10},
      {pitch: toMidi('D#4'), quantizedStartStep: 2*s+10, quantizedEndStep: 2*s+12},
      {pitch: toMidi('B4'), quantizedStartStep: 2*s+12, quantizedEndStep: 2*s+14},
      {pitch: toMidi('F#4'), quantizedStartStep: 2*s+14, quantizedEndStep: 2*s+16},

      {pitch: toMidi('D#4'), quantizedStartStep: 3*s+2, quantizedEndStep: 3*s+4},
      {pitch: toMidi('E4'), quantizedStartStep: 3*s+4, quantizedEndStep: 3*s+6},
      {pitch: toMidi('D#4'), quantizedStartStep: 3*s+6, quantizedEndStep: 3*s+8},
      {pitch: toMidi('B4'), quantizedStartStep: 3*s+8, quantizedEndStep: 3*s+10},
      {pitch: toMidi('F#4'), quantizedStartStep: 3*s+10, quantizedEndStep: 3*s+12},
      {pitch: toMidi('D#4'), quantizedStartStep: 3*s+12, quantizedEndStep: 3*s+14},
      {pitch: toMidi('E4'), quantizedStartStep: 3*s+14, quantizedEndStep: 3*s+16},

    ]
  },
  UNDER_PRESSURE: { 
    title: "Under Pressure",
    totalQuantizedSteps: 62,
    quantizationInfo:{stepsPerQuarter: 4},
    notes: [
      {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2},
      {pitch: 60, quantizedStartStep: 2, quantizedEndStep: 4},
      {pitch: 60, quantizedStartStep: 4, quantizedEndStep: 6},
      {pitch: 60, quantizedStartStep: 6, quantizedEndStep: 7},
      {pitch: 60, quantizedStartStep: 7, quantizedEndStep: 8},
      {pitch: 60, quantizedStartStep: 8, quantizedEndStep: 10},
      {pitch: 55, quantizedStartStep: 10, quantizedEndStep: 12},

      {pitch: 60, quantizedStartStep: s+0, quantizedEndStep: s+2},
      {pitch: 60, quantizedStartStep: s+2, quantizedEndStep: s+4},
      {pitch: 60, quantizedStartStep: s+4, quantizedEndStep: s+6},
      {pitch: 60, quantizedStartStep: s+6, quantizedEndStep: s+7},
      {pitch: 60, quantizedStartStep: s+7, quantizedEndStep: s+8},
      {pitch: 60, quantizedStartStep: s+8, quantizedEndStep: s+10},
      {pitch: 55, quantizedStartStep: s+10, quantizedEndStep: s+12},

      {pitch: 60, quantizedStartStep: s+s+0, quantizedEndStep: s+s+2},
      {pitch: 60, quantizedStartStep: s+s+2, quantizedEndStep: s+s+4},
      {pitch: 60, quantizedStartStep: s+s+4, quantizedEndStep: s+s+6},
      {pitch: 60, quantizedStartStep: s+s+6, quantizedEndStep: s+s+7},
      {pitch: 60, quantizedStartStep: s+s+7, quantizedEndStep: s+s+8},
      {pitch: 60, quantizedStartStep: s+s+8, quantizedEndStep: s+s+10},
      {pitch: 55, quantizedStartStep: s+s+10, quantizedEndStep: s+s+12},
      
      {pitch: 60, quantizedStartStep: 3*s+0, quantizedEndStep: 3*s+2},
      {pitch: 60, quantizedStartStep: 3*s+2, quantizedEndStep: 3*s+4},
      {pitch: 60, quantizedStartStep: 3*s+4, quantizedEndStep: 3*s+6},
      {pitch: 60, quantizedStartStep: 3*s+6, quantizedEndStep: 3*s+7},
      {pitch: 60, quantizedStartStep: 3*s+7, quantizedEndStep: 3*s+8},
      {pitch: 60, quantizedStartStep: 3*s+8, quantizedEndStep: 3*s+10},
      {pitch: 55, quantizedStartStep: 3*s+10, quantizedEndStep: 3*s+12},
    ]
  },
  DRUMS:{
    notes: [
      { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
      { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
      { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
      { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
      { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
      { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
      { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
      { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
      { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
      { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
    ],
    quantizationInfo: {stepsPerQuarter: 4},
    tempos: [{time: 0, qpm: 120}],
    totalQuantizedSteps: 11
  }
}
melodiesInt.TWINKLE_TWINKLE_2T = transposeMelody(-12)(melodiesInt.TWINKLE_TWINKLE_2)
melodiesInt.TWINKLE_TWINKLE_2T.title="Twinkle Twinkle 2T"

export const melodies = mapValues(melodiesInt,(value,key,obj)=>{
  return {...value,key} 
})