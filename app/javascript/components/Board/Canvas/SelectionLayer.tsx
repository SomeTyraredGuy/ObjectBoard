import React from 'react'
import { Layer, Rect } from 'react-konva'
import { Point, Size } from '../../../Types/CanvasObjects'

type Props = {
    origin: Point,
    current: Point,
    scale: number
}

function SelectionLayer({origin, current, scale} : Props) {
    console.log(origin)
  return (
    <Layer>
        <Rect
            x={origin.x}
            y={origin.y}
            width={current.x - origin.x}
            height={current.y - origin.y}
            fill='transparent'
            stroke='black'
            opacity={0.7}
            lineJoin='round'
            dash={[10 / scale, 10 / scale]}
            strokeWidth={1 / scale}
        />
    </Layer>
  )
}

export default SelectionLayer