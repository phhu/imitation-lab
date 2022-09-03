import { createAsyncThunk } from '@reduxjs/toolkit'
import { removeNonJson, forceQuantized } from './utilsMelody'
import { sequencesMatch, sequencesIdentical } from './compare'
import { BLANK } from './melodies'

export const nextMelody = createAsyncThunk(
  'meme/next',
  async ({
    skipDuplicates = true,
    direction
  } = {}, { dispatch, getState }) => {
    const { memes, interpolate: i } = getState()
    const size = i.melodies.length
    const width = Math.ceil(Math.sqrt(size))
    const currentMelody = i.melodies[i.current]
    direction = direction || i.direction || [0, 1]
    const next = (cur, [xdir, ydir]) => cur + xdir + (width * ydir)
    let nextMelody = currentMelody
    let newCurrent = i.current
    // don't allow same melody twice
    while (sequencesIdentical(currentMelody, nextMelody)) { // true first time
      newCurrent = (2 * size + next(newCurrent, direction)) % size
      nextMelody = i.melodies[newCurrent] ?? BLANK
    }
    // console.log("next melody",newCurrent,nextMelody)
    return {
      nextMelody: nextMelody ?? BLANK,
      newCurrent,
      direction
    }
  }, {}
)
