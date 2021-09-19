import React, { useState, useEffect } from 'react'
//import ReactDOM from "react-dom"

//const melody = require('../melodies')

export default (props) => {
  const divid = `score${props.scoreid}`
  useEffect(() => {
    try{
      const staff = new core.StaffSVGVisualizer(
        props.melody,    
        document.getElementById(divid)
      )
    } catch(e){
      console.error("no score to draw")
      //console.error("Error in StaffSVGVisualizer:",e)
    }
  })
  const click = () => {
    console.log('playing',divid)
    //midiPlayer.start(props.melody)
    player.start(props.melody)
    //window.player.playNote(0,{pitch:40,startTime:0,endTime:1})
  }
  //console.log("Score:props",props)
  return (
    <div>
      <div>{props.title}</div>
      <div id={divid}></div>
      <button onClick={click}>Play</button>
    </div>
  )
}

