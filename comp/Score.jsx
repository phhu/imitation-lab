import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {removeNonJson, forceQuantized} from '../utilsMelody'
import {BLANK} from '../melodies'
import Selector from './Selector'
import {Declutter} from './Declutter'
import {startPlayer, stopPlayer} from '../transport'

const {transposeMelody} = require('../utilsMelody')

import {varyMelody} from '../vary'

export default ({
  meme,
  scoreid,
  title,
  hasSelect=true,
  hasCollapse = true,
  margin="8px", 
  padding="5px",
  divClassName = undefined,
  hasToWorking = true,
  hasSave = false,
  btnPlay,
  btnStop,
  children,
}) => {
  const { 
    transpose=0,
    src,
    variationCount=0,
    matchesRecording=false,
    isVarying=false,
    isPlaying=false,
  } = useSelector(s=>(s?.memes?.[meme])) || {}
  const store = useStore()
  const melodies = useSelector(s=>s.melodies)
  const dispatch = useDispatch()
  const declutter = useSelector(s=>s.declutter)
  
  //const [isPlaying, setIsPlaying] = useState(false)  
  const setIsPlaying = value => dispatch(actions.isPlaying({meme,value}))
  const scoreDivId = `score${scoreid}`
  const melody = transposeMelody(parseInt(transpose) || 0)(src) || BLANK

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
    if (isPlaying){
      stop()
    } else {
      setIsPlaying(true)
      return startPlayer(
        {melody, tempo:store.getState().tempo}
      ).then(()=>{
        setIsPlaying(false)
      })
    }
  }
  const stop = () => {
    setIsPlaying(false)
    stopPlayer()
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

      <button 
        title="Play this melody" 
        onClick={play}
        className="btnPlayScore"
        ref={btnPlay}
        style={{ 
          backgroundColor: isPlaying ? "green" : "inherit",
        }}
      >{isPlaying ? "■":"▶" }</button>
      <button 
        className="btnStopScore" 
        ref={btnStop}
        title="Stop playing this melody" 
        onClick={stop}
      >■</button>
      <Declutter>


        { hasToWorking &&
          <button 
            title="Set this melody as TARGET"
            onClick={()=>dispatch(actions.memeToWorking(meme))}
          >🎯</button>
        }
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
        {hasSave &&
          <button 
            title="Save melody (will appear in drop down lists)"
            onClick={()=>dispatch(actions.saveMelody({
              meme, 
              name:window.prompt("Save melody name:","saved melody")
            }))}
          >💾</button>
        } 
        <button 
          title="Produce a variation of this melody using Google Magenta"
          onClick={vary} id={varyButtonId} style={{
          backgroundColor: isVarying ? "green": undefined
        }}>Vary{variationCount?` (${variationCount})`:''}</button>
      </Declutter>
      {children}
      <div id={scoreDivId}></div>
    </div>
  )
}

