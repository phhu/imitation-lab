import React, { useState, useEffect } from 'react'
//import ReactDOM from "react-dom"

//const melody = require('../melodies')

export default (props) => {
  const scoreDivId = `score${props.scoreid}`
  let [melody, setMelody] = useState(props.melody)
  useEffect(() => setMelody(props.melody), [props.melody])
  let [isVarying, setIsVarying]  = useState(false)
  //console.log("drawing Score",props.melody,melody,isVarying)
  useEffect(() => {
    try {
      const staff = new core.StaffSVGVisualizer(
        melody,    
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
    midiPlayer.start(melody)
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
      <div>{props.title}</div>
      <div id={scoreDivId}></div>
      <button onClick={play}>Play</button>
      <button onClick={stop}>Stop</button>
      <button onClick={vary} style={{
        backgroundColor: isVarying ? "green": "inherit"
      }}>Vary</button>
    </div>
  )
}

