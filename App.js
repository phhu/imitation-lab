import React, { useState, useEffect } from 'react'
//const fp = require('lodash/fp')
//import ReactDOM from "react-dom"

import Keyboard from './comp/Keyboard'
import Score from './comp/Score'
import Recorder from './comp/Recorder'

const melody = require('./melodies')


function App() {
  const test={test:1}
  return (
    <div id="root">
      <Score title="Melody 1" scoreid="1" melody={melody.MELODY1} />
      <Score title="Twinkle"  scoreid="2" melody={melody.TWINKLE_TWINKLE} />
      <Keyboard />
      <Recorder {...test}/>
    </div>
  );
}


export default App 
 
