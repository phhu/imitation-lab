import { createAsyncThunk} from '@reduxjs/toolkit'
import {removeNonJson, forceQuantized} from './utilsMelody'
import { sequencesMatch,sequencesIdentical} from './compare'
import { BLANK } from './melodies'


const next = cur => cur+1

export const nextMelody = createAsyncThunk(
  'meme/next',
  async ({
    skipDuplicates=true
  }={}, {dispatch,getState}) => {
    const {memes, interpolate:i} = getState()
    // sequencesMatch check in here
    // plus need some idea of direction
    const currentMelody = i.melodies[i.current]
    let nextMelody = currentMelody 
    let newCurrent = i.current
    while ( sequencesIdentical(currentMelody,nextMelody)){
      newCurrent = next(newCurrent)
      nextMelody = i.melodies[newCurrent] || BLANK
    }
    //console.log("next melody",newCurrent,nextMelody)
    return {
      nextMelody: nextMelody ?? BLANK, 
      newCurrent
    }
  },{}
)

