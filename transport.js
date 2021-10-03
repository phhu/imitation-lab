
const {isQuantizedSequence,unquantizeSequence} = core.sequences
import {store} from './reduxStore'
import {delay} from './utilsMelody'

// set velocity to something sensible if it's not specified
const defaultVelocity = velocity => n => ({velocity, ...n})
const gateEndTime = pc => n => ({
  ...n,
  endTime: n.startTime + pc * (n.endTime - n.startTime)
})
const regulariseMelody = ({velocity}) => melody => ({
  ...melody,
  notes: melody.notes
    .map(defaultVelocity(velocity))
    //.map(gateEndTime(0.95))
})

//const p = ()=>window.player
const p = ()=>midiPlayer

export const playDrumNow = (pitch=50) => {
  player.isPlaying() && player.stop()
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
  // const uMelody = isQuantizedSequence(melody) ?
  //  unquantizeSequence(melody,tempo) : melody
  //console.log("startPlayer", melody,uMelody)
  stopPlayer()
  return delay(10)().then(()=>
    p().start(
      regulariseMelody({velocity})(melody),
      isQuantizedSequence(melody) ? tempo : undefined
    )  // returns promise
  )
}

export const stopPlayer = () => 
  p().isPlaying() && p().stop()
