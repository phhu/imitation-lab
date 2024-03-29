import { createReducer, createAction, configureStore } from '@reduxjs/toolkit'
import { reducer, actions, initialState } from './reduxMainSlice'
import { assign } from 'lodash/fp'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

// console.log("merged state",merge (initialState,(loadState() ||  {})))
// console.log("merged state2",merge (initialState,loadState()))
// console.log("merged state3",merge (loadState(),initialState))
// console.log("merged state4",merge ((loadState() ||  {}),initialState))

export const saveState = (state) => {
  try {
    const serializesState = JSON.stringify(state)
    localStorage.setItem('state', serializesState)
  } catch (err) {
    console.log(err)
  }
}

export { actions }

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // .concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: assign(initialState, loadState())
  // enhancers: [reduxBatch],
})

store.subscribe(() => {
  saveState(store.getState())
})
