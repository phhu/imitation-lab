module.exports = {
  cancelNote: pitch=>(note,i,arr)=>{
    if(note.pitch === pitch){
      note.envelope.cancel();
      arr.splice(i, 1);
    }
  }



}