import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {change} from '../reduxStore'
import {removeNonJson} from '../utilsMelody'
import {BLANK} from '../melodies'

const {transposeMelody} = require('../utilsMelody')
const {trim, quantizeNoteSequence,isQuantizedSequence} = core.sequences

export default ({meme,scoreid,title}) => {
  const transpose = useSelector(s=>s?.memes[meme]?.transpose) || 0
  const src = useSelector(s=>s?.memes[meme]?.src) || BLANK
  const variationCount = useSelector(s=>s?.memes[meme]?.variationCount || 0)
  const store = useStore()
  const dispatch = useDispatch()
  
  console.log("score",meme, transpose)
  const scoreDivId = `score${scoreid}`
  const melody = transposeMelody(parseInt(transpose) || 0)(src)

  let [isVarying, setIsVarying] = useState(false)
  //console.log("drawing Score",props.melody,melody,isVarying)
  useEffect(() => {
    try {
      const staff = new core.StaffSVGVisualizer(       // WaterfallSVGVisualizer is bad...
        isQuantizedSequence(melody) ? melody : quantizeNoteSequence(melody),    
        document.getElementById(scoreDivId)
      )
    } catch(e){
      console.error("no score to draw",e)
      //console.error("Error in StaffSVGVisualizer:",e)
    }
  })

  const play = () => {
    console.log('playing',scoreDivId,melody)
    midiPlayer.stop()
    if(isQuantizedSequence(melody)){
      midiPlayer.start(melody,store.getState().tempo)
    } else {
      midiPlayer.start(melody)
    }
    //player.start(melody)
    //window.player.playNote(0,{pitch:40,startTime:0,endTime:1})
  }
  const stop = () => {
    console.log('stopping playing',scoreDivId)
    midiPlayer.stop()
    //player.stop()
    //window.player.playNote(0,{pitch:40,startTime:0,endTime:1})
  }
  const varyButtonId = "btn_" + scoreDivId
  const vary = () => {
    console.log('vary playing',scoreDivId)
    setIsVarying(true)
    document.querySelector(`#${varyButtonId}`).style.backgroundColor="red"
    model.similar(melody,2,0.75)
      .then(newSamples => {
        console.log("made samples")
        //newSamples.forEach((ns,i)=>ns.title=melody.title+"_"+i)
        // const n = newSamples[0]
        // {
        //   notes: n.notes,
        //   totalQuantizedSteps: n.totalQuantizedSteps,
        //   quantizationInfo: n.quantizationInfo,
        // }
        // console.log("tidied",
        //   newSamples[0],
        //   //removeNonJson( newSamples[0]),
        //   //JSON.stringify({...newSamples[0]})
        // )
        dispatch(change.memeSrc({
          meme,
          melody: {
            title: melody.title,
            ...removeNonJson( newSamples[0])
          },
          transpose:0
        }))
        setIsVarying(false)
      });
  }

  return (
    <div>
      <div>{melody.title || title} {variationCount || ''}</div>
      <div id={scoreDivId}></div>
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <button onClick={vary} id={varyButtonId} style={{
        backgroundColor: isVarying ? "green": "inherit"
      }}>Vary</button>
    </div>
  )
}

