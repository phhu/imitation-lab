
const interpolateMelodies = (mel1,mel2,{count=3}={}) => {
  /* interpolate(
      inputSequences: INoteSequence[], 
      numInterps: number | number[], 
      temperature?: number, 
      controlArgs?: MusicVAEControlArgs
    ): Promise<INoteSequence[]>
  */
  model.interpolate([mel1,mel2],count,0.5)
  .then(newMelodies => {
    console.log("interpolated:",newMelodies)
    global.samples = newMelodies
    // const d = document.getElementById("interpolatedMelodies")
    // d.innerHTML=""
    // global.samples.forEach((s,i)=>{
    //   d.innerHTML+=`<div id="staffInt${i}"></div>`
    //   d.innerHTML+=`<button id="buttonInt${i}" onclick="console.log('playing Int${i}');playMelody(samples[${i}]);">Play Int ${i}</button>`;
    //   visualizeMelody({scoreDiv:"staffInt",n:i})(s);
    //   /*makeButton({
    //     id: `Play_Int_${i}`,
    //     parent: `staffInt${i}`,
    //     fn: (() => () => {log("clicked "+ i)}),
    //   });*/
    // })
  })
}

module.exports = {
  interpolateMelodies
}