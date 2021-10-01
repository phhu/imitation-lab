import { createAsyncThunk} from '@reduxjs/toolkit'
import {removeNonJson, forceQuantized} from './utilsMelody'
import { sequencesMatch} from './compare'

export const nextMelody = createAsyncThunk(
  'meme/next',
  async ({
    skipDuplicates=true
  }={}, {dispatch,getState}) => {
    const {memes, interpolate:i} = getState()
    // sequencesMatch check in here
    // plus need some idea of direction
    const newCurrent = i.current+1
    let nextMelody = i.melodies[newCurrent]
    console.log("next melody",newCurrent,nextMelody)
    return {nextMelody, newCurrent}
  },{}
)