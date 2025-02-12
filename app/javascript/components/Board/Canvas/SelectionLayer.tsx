import React from 'react'
import { Layer, Rect } from 'react-konva'
import { Point, Size } from '../../../Types/CanvasObjects'

type Props = {
    visible: boolean,
    point: Point,
    size: Size,
    scale: number,
}

function SelectionLayer({visible, point, size, scale} : Props) {
  return (
    <Layer>
        <Rect
            visible={visible}
            x={point.x}
            y={point.y}
            width={size.width}
            height={size.height}
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