import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {removeNonJson, forceQuantized} from '../utilsMelody'
//import {melodies} from '../melodies'
import Selector from './Selector'

const {transposeMelody} = require('../utilsMelody')
const {isQuantizedSequence} = core.sequences
import {varyMelody} from '../vary'
import {interpolateMelodies} from '../interpolate'


export default ({
  meme,scoreid,title,
  hasSelect=true, margin="10px", padding="5px",
  interpolationTarget, 
}) => {
  const {
    transpose=0,
    src=melodies.BLANK,
    variationCount=0,
    matchesRecording=false,
    isVarying=false,
  } = useSelector(s=>s?.memes[meme])
  // const src = useSelector(s=>s?.memes[meme]?.src) || melodies.BLANK
  // const variationCount = useSelector(s=>s?.memes[meme]?.variationCount || 0)
  // const matchesRecording = useSelector(s=>s?.memes[meme]?.matchesRecording || false)
  const store = useStore()
  const dispatch = useDispatch()
  
  //console.log("score",meme, transpose)
  const scoreDivId = `score${scoreid}`
  const melody = transposeMelody(parseInt(transpose) || 0)(src)

  //console.log("drawing Score",props.melody,melody,isVarying)
  useEffect(() => {
    try {
      // WaterfallSVGVisualizer is bad...
      const staff = new core.StaffSVGVisualizer(       
        forceQuantized({stepsPerQuarter:4})(melody),    
        document.getElementById(scoreDivId)
      )
    } catch(e){
      console.error("no score to draw",e)
      //console.error("Error in StaffSVGVisualizer:",e)
    }
  })

  const play = () => {
    //console.log('playing',scoreDivId,melody)
    midiPlayer.stop()
    midiPlayer.start(
      melody,
      isQuantizedSequence(melody) ? store.getState().tempo : undefined
    )
  }
  const stop = () => {
    midiPlayer.stop()
  }
  const varyButtonId = "btn_" + scoreDivId
  const vary = () => dispatch(varyMelody({melody,meme}))

  return (
    <div style={{
      margin,
      padding,
      "backgroundColor": matchesRecording ? "#afa" : "#eee",
    }}>
      {title && (<span>{title} </span>)}
      {hasSelect && (
      <Selector
        value={melody.key}
        options={Object.values(store.getState().melodies)}
        values={(o,i)=>o.key}
        displayValues={(o,i)=>o.title}
        change={(value)=>{
          // if (interpolationTarget){
          //   console.log("interpolating",interpolationTarget)
          //   dispatch(interpolateMelodies({
          //     // sourceMelody,
          //     // goalMelody,
          //     melody: store.getState().melodies[value],
          //     meme,
          //     interpolationTarget,              
          //   }))
          // } else {
           // console.log("not interpolating",interpolationTarget)
            dispatch(actions.memeSrc({
              meme,
              melody: store.getState().melodies[value],
              transpose: 0, 
              resetVarationCount: true,
            }))
          //}
        }}
      />
      )} 
      <div id={scoreDivId}></div>
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <button onClick={vary} id={varyButtonId} style={{
        backgroundColor: isVarying ? "green": "inherit"
      }}>Vary{variationCount?` (${variationCount})`:''}</button>
    </div>
  )
}

