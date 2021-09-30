import {createReducer, createAction, configureStore} from '@reduxjs/toolkit'
import {reducer,actions,initialState} from './reduxMainSlice'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializesState = JSON.stringify(state);
    localStorage.setItem("state", serializesState);
  } catch (err) {
    console.log(err);
  }
};

export {actions}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware() ,//.concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState() || initialState,
  //enhancers: [reduxBatch],
})

store.subscribe(() => {
  saveState(store.getState());
});


