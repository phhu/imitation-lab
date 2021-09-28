import {createReducer, createAction, configureStore} from '@reduxjs/toolkit'
import {preloadedState,actions} from './reduxModel'

//import {Provider, shallowEqual, useDispatch, useSelector,useStore } from 'react-redux'

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
  preloadedState,
  //enhancers: [reduxBatch],
})



