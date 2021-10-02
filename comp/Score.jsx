import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {removeNonJson, forceQuantized} from '../utilsMelody'
import {BLANK} from '../melodies'
import Selector from './Selector'
import {Declutter} from './Declutter'

const {transposeMelody} = require('../utilsMelody')
const {isQuantizedSequence} = core.sequences
import {varyMelody} from '../vary'

export default ({
  meme,
  scoreid,
  title,
  hasSelect=true,
  hasCollapse = true,
  margin="10px", 
  padding="5px",
  divClassName = undefined,
  hasToWorking = true,
  hasSave = false
}) => {
  const {
    transpose=0,
    src=BLANK,
    variationCount=0,
    matchesRecording=false,
    isVarying=false,
  } = useSelector(s=>(s?.memes?.[meme])) || {}
  // const src = useSelector(s=>s?.memes[meme]?.src) || melodies.BLANK
  // const variationCount = useSelector(s=>s?.memes[meme]?.variationCount || 0)
  // const matchesRecording = useSelector(s=>s?.memes[meme]?.matchesRecording || false)
  const store = useStore()
  const melodies = useSelector(s=>s.melodies)
  const dispatch = useDispatch()
  const declutter = useSelector(s=>s.declutter)
  //console.log("score",meme, transpose)
  const scoreDivId = `score${scoreid}`
  const melody = transposeMelody(parseInt(transpose) || 0)(src)

  //console.log("drawing Score",props.melody,melody,isVarying)
  useEffect(() => {
    try {
      // WaterfallSVGVisualizer is bad...
      // Visualizer is ok - https://magenta.github.io/magenta-js/music/classes/_core_visualizer_.visualizer.html
      const staff = new core.StaffSVGVisualizer (   // StaffSVGVisualizer       
        forceQuantized({stepsPerQuarter:4})(melody),    
        document.getElementById(scoreDivId)
      )
    } catch(e){
      console.error("no score to draw",e)
      //console.error("Error in StaffSVGVisualizer:",e)
    }
  },[src,transpose,declutter])

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
    <div className={divClassName} style={{
      margin,
      padding,
      "backgroundColor": matchesRecording ? "#afa" : "#eee",
    }}>
      {title && (<span>{title} </span>)}
      <Declutter>
        {hasSelect && (
        <Selector
          value={melody.key}
          options={Object.values(melodies)}
          values={(o,i)=>o.key}
          displayValues={(o,i)=>o.title || o.key}
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
      </Declutter>
      <button title="Play this melody" onClick={play}>▶</button>
      <button title="Stop playing this melody" onClick={stop}>■</button>
      <Declutter>
        <button 
          title="Produce a variation of this melody using Google Magenta"
          onClick={vary} id={varyButtonId} style={{
          backgroundColor: isVarying ? "green": undefined
        }}>Vary{variationCount?` (${variationCount})`:''}</button>

        { hasToWorking &&
          <button 
            title="Set TARGET to this melody"
            onClick={()=>dispatch(actions.memeToWorking(meme))}
          >🎯</button>
        }
        {  hasSave &&
          <button 
            title="Save melody (will appear in drop down lists)"
            onClick={()=>dispatch(actions.saveMelody({
              meme, 
              name:window.prompt("Save melody name:","saved melody")
            }))}
          >💾</button>
        }
      </Declutter>
      <div id={scoreDivId}></div>
    </div>
  )
}

