import { createAsyncThunk} from '@reduxjs/toolkit'
import {removeNonJson, forceQuantized} from './utilsMelody'
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
    source,
    target,
    stepsPerQuarter=8,
    count = 10,
    temperature = 0.5,
  }, {dispatch,getState}) => {
    const {memes} = getState()
    const inputSequences = [memes[source],memes[target]]
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
    return newMelodies.map(removeNonJson)
  },{}
)

//const {dispatch,getState} = thunkAPI