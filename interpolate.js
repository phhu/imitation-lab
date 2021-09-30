import { createAsyncThunk} from '@reduxjs/toolkit'
import {removeNonJson, forceQuantized} from './utilsMelody'
import {melodies} from './melodies'
// https://magenta.github.io/magenta-js/music/classes/_music_vae_model_.musicvae.html#interpolate
  /* interpolate(
      inputSequences: INoteSequence[], 
      numInterps: number | number[], 
      temperature?: number, 
      controlArgs?: MusicVAEControlArgs
    ): Promise<INoteSequence[]>
  */

//see https://redux-toolkit.js.org/api/createAsyncThunk
export const interpolateMelodies = createAsyncThunk(
  'meme/interpolate',
  async ({
    //sourceMelody,
    //goalMelody,
    melody,
    meme,interpolationTarget,
    stepsPerQuarter=8,
    count = 8,
    temperature = 0.75,
  }, {dispatch,getState}) => {
    const {memes} = getState()
    const inputSequences = [memes[meme],memes[interpolationTarget]]
      .map(m=>m.src)
      .map(forceQuantized({stepsPerQuarter}))
      .map(removeNonJson)
    // const inputSequences = [melodies.LIBERTANGO,melodies.TWINKLE_TWINKLE]
    // const inputSequences = [melodies.LIBERTANGO,melodies.TWINKLE_TWINKLE]
    // const inputSequences = [melodies.LIBERTANGO_2,melodies.TWINKLE_TWINKLE_2]
    // const inputSequences = [
    //   //melodies.MELODY1,
    //   //melodies.MELODY3,
    //   melodies.LIBERTANGO_2,
    //   melodies.TWINKLE_TWINKLE_2,
    // ]
    // const inputSequences = [melodies.MELODY3,melodies.MELODY1]
    console.log("inputSequences",inputSequences)
    const newMelodies = await model.interpolate(
      inputSequences,
      count,
      temperature
    )
    console.log("new melodies",newMelodies)
    return newMelodies.map(removeNonJson)
  },{}
)

//const {dispatch,getState} = thunkAPI