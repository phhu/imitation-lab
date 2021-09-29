
export const transposeMelody = diff => melody => ({...melody, 
  notes: melody.notes.map(note=>({...note,pitch:note.pitch+diff})  ) 
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

export const removeNonJson = x => JSON.parse(JSON.stringify(x))

export const roundToDPs = dps => x => Math.round((x + Number.EPSILON) * 10**dps) / 10**dps