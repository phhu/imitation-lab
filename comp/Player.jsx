import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { actions } from '../reduxStore'

import Selector from './Selector'
import Checkbox from './Checkbox'

import { uniq } from 'lodash'

export const Player = (props) => {
  const dispatch = useDispatch()
  const midiOutput = useSelector(s => s.midiOutput)
  const { playClick } = useSelector(s => s.player)
  midiPlayer.playClick = playClick
  player.playClick = playClick

  useEffect(() => {
    midiPlayer.outputs = [midiPlayer.availableOutputs[parseInt(midiOutput)]]
  }, [midiOutput])

  return (
    <div className='box'>
      PLAYER &nbsp;&nbsp;
      Midi out <Selector
        title='MIDI instrument to play output to. Midi through is default'
        options={uniq(midiPlayer.availableOutputs)}
        value={midiOutput}
        change={(value) => {
          midiPlayer.outputs = [midiPlayer.availableOutputs[value]]
          dispatch(actions.midiOutput(value))
          console.log('output changed to', value)
        }}
               /> &nbsp;&nbsp;

      <Checkbox
        title='Include metronome when playing melodies'
        checked={playClick}
        label='Click on play'
        onChange={e => dispatch(actions.playClick(e.target.checked))}
      />
    </div>
  )
}
