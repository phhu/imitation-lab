import { createAsyncThunk} from '@reduxjs/toolkit'
import {removeNonJson, forceQuantized} from './utilsMelody'

//see https://redux-toolkit.js.org/api/createAsyncThunk
export const varyMelody = createAsyncThunk(
  'meme/vary',
  async ({
    melody,
    meme,   // will be in args
    stepsPerQuarter=8,
    count = 20,
    temperature = 0.75,
  }, thunkAPI) => {
    const {dispatch,getState} = thunkAPI
    //const newSamples = await Promise.resolve(["test"])
    const newSamples = await model.similar(
      forceQuantized({stepsPerQuarter})(melody),
      count,
      temperature
    )
    return removeNonJson(newSamples[0])
    // return {
    //   meme,
    //   melody: {
    //     title: melody.title,
    //     key: melody.key,
    //     ...removeNonJson(newSamples[0])
    //   },
    //   transpose: 0,
    // }
  },{} 
)
