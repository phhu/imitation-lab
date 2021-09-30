import {actions} from './reduxStore'
const sequencesMatch = (seq1,seq2) => { 
  if (seq1.notes.length !== seq2.notes.length){return false;}
  
  for (let i=0 ; i<seq1.notes.length; i++){
    if(seq1.notes[i].pitch !== seq2.notes[i].pitch){return false;}
  }
  return true;
};

const matchRecording = rec => (dispatch, getState) => {
  console.log("in matchRecording")
  dispatch(actions.recording(rec))
}

module.exports = {
  sequencesMatch,
  matchRecording
};