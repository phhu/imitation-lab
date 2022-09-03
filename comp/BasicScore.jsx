import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { forceQuantized } from '../utilsMelody'
import { actions } from '../reduxStore'
import { BLANK } from '../melodies'
import { startPlayer, stopPlayer } from '../transport'
import { Declutter } from './Declutter'
const { isQuantizedSequence } = core.sequences

export const useScoreVis = () => {

}

export default ({
  melody = BLANK,
  title,
  scoreid,
  index = undefined,
  highlight = false,
  margin = '10px',
  padding = '5px'
}) => {
  const scoreDivId = `score${scoreid}`
  const store = useStore()
  const dispatch = useDispatch()
  const declutter = useSelector(s => s.declutter)
  const scoreType = useSelector(s => (s.scoreType ?? 1))
  const [isPlaying, setIsPlaying] = useState(false)

  const vis = ['StaffSVGVisualizer', 'StaffSVGVisualizer', 'PianoRollCanvasVisualizer']
  const visTarget = [scoreDivId, scoreDivId, scoreDivId + '_canvas']
  // console.log("scoretype",scoreType,vis[scoreType],visTarget)
  useEffect(() => {
    try {
      if (scoreType > 0) {
        // WaterfallSVGVisualizer is bad...
        const staff = new core[vis[scoreType]]( // vis[scoreType]
          forceQuantized({ stepsPerQuarter: 4 })(melody),
          document.getElementById(visTarget[scoreType])
        )
      }
    } catch (e) {
      console.error('no score to draw', e)
      // console.error("Error in StaffSVGVisualizer:",e)
    }
  }, [melody, declutter, scoreType])

  const play = () => {
    // console.log('playing',scoreDivId,melody)
    if (isPlaying) {
      stop()
    } else {
      setIsPlaying(true)
      startPlayer(
        { melody, tempo: store.getState().tempo }
      ).then(() => {
        setIsPlaying(false)
      })
    }
  }
  const stop = () => {
    setIsPlaying(false)
    stopPlayer()
  }

  return (
    <div style={{
      margin,
      padding,
      backgroundColor: (highlight ? '#aaf' : 'inherit')
    }}
    >
      <table>
        <tbody><tr>

          <td>
            <span style={{ textAlign: 'right', float: 'left', width: '1.3em', fontWeight: '900' }}>
              {title ?? ''}
            </span>
          </td>
          <td>

            <button
              title='Play this melody'
              onClick={play}
              className='btnPlayScore'
              style={{
                backgroundColor: isPlaying ? 'green' : 'inherit'
              }}
            >{isPlaying ? '■' : '▶'}
            </button>
            <Declutter>
              <button className='btnStopScore' title='Stop playing this melody' onClick={stop}>■</button>
            </Declutter>
            <button
              title='Set this melody as TARGET'
              onClick={() => dispatch(actions.melodyToWorking({
                melody,
                newCurrent: index
              }))}
            >🎯
            </button>
            <Declutter>
              {true &&
                <button
                  title='Save melody (will appear in drop down lists)'
                  onClick={() => dispatch(actions.saveMelody({
                    melody,
                    name: window.prompt('Save melody name:', 'saved melody')
                  }))}
                >💾
                </button>}
            </Declutter>
          </td>
          <td>
            {scoreType === 1 && <div className='inlineBlock' id={scoreDivId} />}
            {scoreType === 2 && <canvas className='inlineBlock' id={scoreDivId + '_canvas'} />}
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  )
}

/*
<button title="Play this melody" onClick={play}>▶</button>
<button title="Stop playing this melody" onClick={stop}>■</button>
<Declutter>
  <button
    title="Produce a variation of this melody using Google Magenta"
    onClick={vary} id={varyButtonId} style={{
    backgroundColor: isVarying ? "green": undefined
  }}>Vary{variationCount?` (${variationCount})`:''}</button>

  { hasToWorking &&
    <button
      title="Set TARGET to this melody"
      onClick={()=>dispatch(actions.memeToWorking(meme))}
    >🎯</button>
  }
  {  hasSave &&
    <button
      title="Save melody (will appear in drop down lists)"
      onClick={()=>dispatch(actions.saveMelody({
        meme,
        name:window.prompt("Save melody name:","saved melody")

*/
