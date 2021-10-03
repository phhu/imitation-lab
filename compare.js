import {actions} from './reduxStore'
import {mapValues, isEqual} from 'lodash'
import {playDrumNow} from './transport'

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

export const sequencesIdentical = (baseSeq,compSeq) => {
  try {
    return isEqual(notesAsInt(baseSeq.notes),notesAsInt(compSeq.notes))
  } catch(e){
    //console.error("sequencesIdentical error",error)
    return false 
  }

}   //&& isEqual(baseSeq.quantizationInfo,compSeq.quantizationInfo) 
   //&& isEqual(parseInt(baseSeq.totalQuantizedSteps),parseInt(compSeq.totalQuantizedSteps))

export const matchRecording = ({
  sendRecording=true, 
  playSound = false,
  playSoundOnFail = false,
}={}) => (recording) => (dispatch, getState) => {
  const {memes} = getState()
  const matches = mapValues(
    memes,
    (meme,key)=>((key==="recording") ? null :    // don't match recording against self
      sequencesMatch(meme.src,recording)
    ),
  )
  if(playSound && matches.target){playDrumNow(50)}
  if(playSoundOnFail && !(matches.target)){playDrumNow(45)}

  dispatch(actions.recording({
    recording: sendRecording && recording,
    matches
  }))
}
