import React from 'react'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'

type Props = {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>
}

function ObjectsProperties({canvasState}: Props) {
    
  return (
    <table>
      <tr>
      </tr>
      { canvasState.mode === CanvasMode.Selected &&
        canvasState.objects.map((object, i) => {
          return (
            <div key={i}>
              {object.type}
            </div>
          )
        })
      }
    </table>
  )
}

export default ObjectsProperties