import { createAsyncThunk} from '@reduxjs/toolkit'
import {removeNonJson, forceQuantized,trimToBars} from './utilsMelody'
const {trim} = core.sequences
//import {melodies} from './melodies'
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
    sources,
    stepsPerQuarter=8,
    count = 8,
    temperature = 1,
  }, {dispatch,getState}) => {
    const {memes, interpolate} = getState()
    const inputSequences = sources.map(s=>memes[s])
      .map(m=>m.src)
      .map(forceQuantized({stepsPerQuarter}))
      .map(removeNonJson)
    //console.log("inputSequences",inputSequences)
    const newMelodies = await model.interpolate(
      inputSequences,
      count,
      temperature
    )
    //console.log("new melodies",newMelodies)
    return newMelodies
      .map(trimToBars(2))    // 4 beats, two bars - remove dangling beats
      .map(removeNonJson)
  },{}
)

//const {dispatch,getState} = thunkAPI