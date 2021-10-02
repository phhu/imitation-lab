import {BLANK} from './melodies'

const {trim, quantizeNoteSequence,isQuantizedSequence} = core.sequences

export const transposeMelody = diff => melody => ({...melody, 
  notes: melody?.notes?.map(note=>({...note,pitch:note.pitch+diff})  ) || BLANK
})

export const makeNote = midiNumber => 
  ({pitch:midiNumber,velocity:50,startTime:0,endTime:0})

export const extraLeft=  {
  natural: '\\',
  flat: '',
  sharp: 'a]'
}

export const extraRight = {
  natural: ']',
  flat: '=',
  sharp: ''
}

export const limit = (min, max) => x => Math.min(Math.max(min,x),max)

export const removeNonJson = x => JSON.parse(JSON.stringify(x))

export const roundToDPs = dps => x => Math.round((x + Number.EPSILON) * 10**dps) / 10**dps

export const trimToBars = bars => x=>trim(
  x,
  0,
  4*(x?.quantizationInfo?.stepsPerQuarter ?? 4)*bars
)

export const forceQuantized = ({stepsPerQuarter=4}) => melody =>
  isQuantizedSequence(melody) ? melody : quantizeNoteSequence(melody,stepsPerQuarter)