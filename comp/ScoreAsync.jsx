import React, { useState, useEffect } from 'react'
import {useAsyncHook} from  './hooks'
import {useDispatch, useSelector, useStore} from 'react-redux'

export default (props) => {
  const scoreDivId = `score${props.scoreid}`
  let [melodies, setMelodies] = useState(props.melodies)

        // preparedModel
      // .then(()=>model.interpolate(melodies,3,0.5)))
      // (props.melodies)
  const [newMelodies, loading] = useAsyncHook( 
    (melodies)=> window.model.interpolate(melodies,3,0.5))
      (props.melodies);
  
  console.log("loading",loading,newMelodies)
  const melody = newMelodies[1] || props.melodies[0]
  
  let [isVarying, setIsVarying]  = useState(false)
  //console.log("drawing Score",props.melody,melody,isVarying)
  useEffect(() => {
    try {
      const staff = new core.StaffSVGVisualizer(       // WaterfallSVGVisualizer is bad...
        melody,    
        document.getElementById(scoreDivId)
      )
    } catch(e){
      console.error("no score to draw",e)
      //console.error("Error in StaffSVGVisualizer:",e)
    }
  })

  const store = useStore()
  const play = () => {
    console.log('playing',scoreDivId,melody)
    midiPlayer.stop()
    midiPlayer.start(melody,store.getState().tempo)
    //player.start(melody)
    //window.player.playNote(0,{pitch:40,startTime:0,endTime:1})
  }
  const stop = () => {
    console.log('stopping playing',scoreDivId)
    midiPlayer.stop()
    //player.stop()
    //window.player.playNote(0,{pitch:40,startTime:0,endTime:1})
  }
  const vary = () => {
    console.log('vary playing',scoreDivId)
    setIsVarying(true)
    model.similar(melody,2,0.75)
      .then(newSamples => {
        console.log("made samples")
        setMelody(newSamples[0])
        setIsVarying(false)
        //samples = newSamples
      });
  }

  return (
    <div>
      <div>{melody.title || props.title}</div>
      <div id={scoreDivId}></div>
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <button onClick={vary} style={{
        backgroundColor: isVarying ? "green": "inherit"
      }}>Vary</button>
    </div>
  )
}

