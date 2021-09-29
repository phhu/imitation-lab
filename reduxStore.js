import {createReducer, createAction, configureStore} from '@reduxjs/toolkit'
import {preloadedState,actions} from './reduxModel'

//import {Provider, shallowEqual, useDispatch, useSelector,useStore } from 'react-redux'

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

export const change = Object.keys(actions).reduce(
  (acc,cur)=>(acc[cur]=createAction(cur),acc),{}
)

const reducer = createReducer(preloadedState, builder => 
  Object.entries(actions).forEach(([name,fn])=>
    builder.addCase(name,fn)
  )
)

export const store = configureStore({
  reducer,
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState() || preloadedState,
  //enhancers: [reduxBatch],
})

store.subscribe(() => {
  saveState(store.getState());
});


