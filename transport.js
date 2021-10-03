
const {isQuantizedSequence} = core.sequences
import {store} from './reduxStore'

// set velocity to something sensible if it's not specified
const defaultVelocity = velocity => n => ({velocity, ...n})
const regulariseMelody = ({velocity}) => melody => ({
  ...melody,
  notes: melody.notes.map(defaultVelocity(velocity))
})

//const p = ()=>window.player
const p = ()=>midiPlayer

export const playDrumNow = (pitch=50) => {
  player.start({totalTime:0,notes:[{pitch,isDrum:true}]})
}

export const startPlayer = ({
  melody,
  meme,
  tempo=store?.getState()?.tempo || 120,
  velocity=75,
  //regulariseVelocity=true,
}) => {
  if(meme){melody =store.getState().memes?.[meme]?.src}
  //console.log("startPlayer", melody)
  stopPlayer()
  return p().start(
    regulariseMelody({velocity})(melody),
    isQuantizedSequence(melody) ? tempo : undefined
  )  // returns promise
}

export const stopPlayer = () => 
  p().isPlaying() && p().stop()
