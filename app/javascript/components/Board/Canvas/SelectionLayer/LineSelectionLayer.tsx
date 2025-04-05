import React from 'react'
import { Line, Point } from '../../../../Types/CanvasObjects'
import { Layer } from 'react-konva'
import LinePoint from './LinePoint'
import { CanvasState } from '../../../../Types/Canvas'

type Props = {
    line: Line,
    scale: number,
    canvasState: CanvasState,
    setCanvasState,
}

function LineSelectionLayer({line, scale, canvasState, setCanvasState} : Props) {

    let points: Point[] = []
    for (let i = 0; i < line.points.length; i += 2) {
        points.push({
          x: line.points[i],
          y: line.points[i + 1],
        })
    }

    return (
        <Layer>
            
            {points.map((point, i) => {
                return  <LinePoint
                    key={i}
                    point={point}
                    pointIndex={i}
                    scale={scale}
                    canvasState={canvasState}
                    setCanvasState={setCanvasState}
                />
                })
            }
            
        </Layer>
    )
}

export default LineSelectionLayer