import React, { useRef } from 'react'
import { Point } from '../../../../Types/CanvasObjects'
import { Circle } from 'react-konva'
import { onMouseEnter, onMouseLeave } from '../scripts/generalObjectsEventsHandlers'
import { CanvasMode, CanvasState } from '../../../../Types/Canvas'
import { KonvaEventObject } from 'konva/lib/Node'

type Props = {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  point: Point,
  pointIndex: number,
  scale: number,
}

function LinePoint({ canvasState, setCanvasState, point, pointIndex, scale } : Props) {

    function onMouseDown(e: KonvaEventObject<MouseEvent>) {
        e.evt.preventDefault()
        if (canvasState.mode !== CanvasMode.Selected) return

        setCanvasState({
            ...canvasState,
            lineModification: {
                pointIndex: pointIndex,
            },
        })
    }

    function onMouseUp(e: KonvaEventObject<MouseEvent>) {
        e.evt.preventDefault()
        if (canvasState.mode !== CanvasMode.Selected) return

        setCanvasState({
            ...canvasState,
            lineModification: undefined
        })
    }


  return (
    <Circle
        {...point}
        stroke='white'
        opacity={0.7}
        fill='black'
        strokeWidth={1 / scale}
        radius={8 / scale}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
    />
  )
}

export default LinePoint