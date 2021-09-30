import {actions} from './reduxStore'
import {mapValues} from 'lodash'

const sequencesMatch = (baseSeq,compSeq) => { 
  if (baseSeq.notes.length !== compSeq.notes.length){return false;}
  
  for (let i=0 ; i<baseSeq.notes.length; i++){
    if(baseSeq.notes[i].pitch !== compSeq.notes[i].pitch){return false;}
  }
  return true;
};

const matchRecording = (recording, sendRecording=true) => (dispatch, getState) => {
  const {memes} = getState()
  const matches = mapValues(
    memes,
    (meme,key)=>((key==="recording") ? null : 
      sequencesMatch(meme.src,recording)),
    )
  dispatch(actions.recording({
    recording: sendRecording && recording,
    matches
  }))
}

module.exports = {
  sequencesMatch,
  matchRecording
};