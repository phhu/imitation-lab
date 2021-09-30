import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, useStore} from 'react-redux'
import {actions} from '../reduxStore'
import {removeNonJson} from '../utilsMelody'
import {melodies} from '../melodies'
import Selector from './Selector'

const {transposeMelody} = require('../utilsMelody')
const {trim, quantizeNoteSequence,isQuantizedSequence} = core.sequences

async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })
}

export default ({meme,scoreid,title,hasSelect=true}) => {
  const transpose = useSelector(s=>s?.memes[meme]?.transpose) || 0
  const src = useSelector(s=>s?.memes[meme]?.src) || melodies.BLANK
  const variationCount = useSelector(s=>s?.memes[meme]?.variationCount || 0)
  const store = useStore()
  const dispatch = useDispatch()
  
  //console.log("score",meme, transpose)
  const scoreDivId = `score${scoreid}`
  const melody = transposeMelody(parseInt(transpose) || 0)(src)

  let [isVarying, setIsVarying] = useState(false)
  //console.log("drawing Score",props.melody,melody,isVarying)
  useEffect(() => {
    try {
      // WaterfallSVGVisualizer is bad...
      const staff = new core.StaffSVGVisualizer(       
        isQuantizedSequence(melody) ? melody : quantizeNoteSequence(melody,4),    
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
        dispatch(actions.memeSrc({
          meme,
          melody: {
            title: melody.title,
            key: melody.key,
            ...removeNonJson(newSamples[0])
          },
          transpose: 0
        }))
        setIsVarying(false)
      });
  }

  return (
    <div>
      {/* <div>{melody.title} </div> */}
      {hasSelect && (
      <Selector
        value={melody.key}
        options={Object.values(melodies)}
        values={(o,i)=>o.key}
        displayValues={(o,i)=>o.title}
        change={(value)=>{
          dispatch(actions.memeSrc({
            meme,
            melody: melodies[value],
            transpose: 0
          }))        
        }}     
      />
      )} {variationCount || ''}
      <div id={scoreDivId}></div>
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <button onClick={vary} id={varyButtonId} style={{
        backgroundColor: isVarying ? "green": "inherit"
      }}>Vary</button>
    </div>
  )
}

