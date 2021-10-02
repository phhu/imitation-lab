import {actions} from './reduxStore'
import {mapValues, isEqual} from 'lodash'

export const sequencesMatch = (baseSeq,compSeq) => { 
  if (baseSeq === null || compSeq ===null){return false;}
  if (baseSeq.notes.length !== compSeq.notes.length){return false;}
  
  for (let i=0 ; i<baseSeq.notes.length; i++){
    if(baseSeq.notes[i].pitch !== compSeq.notes[i].pitch){return false;}
  }
  return true;
};

const notesAsInt = notes => notes.map(n => ({
  ...n,
  quantizedStartStep: parseInt(n.quantizedStartStep),
  quantizedEndStep: parseInt(n.quantizedEndStep),
}))

export const sequencesIdentical = (baseSeq,compSeq) => 
   isEqual(notesAsInt(baseSeq.notes),notesAsInt(compSeq.notes)) &&
   isEqual(baseSeq.quantizationInfo,compSeq.quantizationInfo) &&
   isEqual(parseInt(baseSeq.totalQuantizedSteps),parseInt(compSeq.totalQuantizedSteps))

export const matchRecording = (recording, sendRecording=true) => (dispatch, getState) => {
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
