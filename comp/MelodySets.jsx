import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import Selector from './Selector'
import {interpolateMelodies} from '../interpolate'

export const MelodySets = ({}={}) => {

  // melodySets: {
  //   current:"test",
  //   sets: [
  //     {name: "test", melodies:["FRERE_2","LICK","UNDER_PRESSURE","TWINKLE_TWINKLE_2T"   ]},
  //     {name: "test2", melodies:["LIBERTANGO_2","BASIC_2","UNDER_PRESSURE","TWINKLE_TWINKLE_2T"   ]},
  //   ],
  // },

  const {sets,current} = useSelector(s=>s.melodySets)
  const dispatch = useDispatch()

  return (<span id="melodySelector">
    <label>Set: 
      <Selector
      title="Change to update melodies to a preset and reset target to start"
      value={current}
      options={sets}
      values={(o,i)=>o.name}
      displayValues={(o,i)=>o.name}
      change={(newSetName)=>{
        dispatch(updateMelodySet({newSetName}))
      }}
    ></Selector>
    </label>
  </span>
  )
}

export const updateMelodySet = ({
  newSetName = ""
}={}) => (dispatch, getState) => {
  dispatch(actions.changeMelodySet(newSetName))
  dispatch(interpolateMelodies({}))
}