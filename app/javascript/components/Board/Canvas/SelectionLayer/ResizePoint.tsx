import React from 'react'
import { Point } from '../../../../Types/CanvasObjects'
import { Circle } from 'react-konva'
import { Side } from '../../../../Types/Canvas'
import { onMouseLeave } from '../scripts/generalObjectsEventsHandlers'
import { KonvaEventObject } from 'konva/lib/Node'

function setOnMouseEnter(cursor: string) {
    return (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage()
        if (!stage) return
        stage.container().style.cursor = cursor
    }
}

type Props = {
    point: Point,
    scale: number,
    side: Side
}

function ResizePoint({point, scale, side} : Props) {
    let cursor: string

    switch (side) {
        case Side.Top:
            cursor = "ns-resize"
            break;
        case Side.Bottom:
            cursor = "ns-resize"
            break;
        case Side.Left:
            cursor = "ew-resize"
            break;
        case Side.Right:
            cursor = "ew-resize"
            break;
        case Side.Top + Side.Left:
            cursor = "nwse-resize"
            break;
        case Side.Top + Side.Right:
            cursor = "nesw-resize"
            break;
        case Side.Bottom + Side.Left:
            cursor = "nesw-resize"
            break;
        case Side.Bottom + Side.Right:
            cursor = "nwse-resize"
            break;
        default:
            return null
    }
    

    return (
        <Circle
            {...point}
            stroke='white'
            opacity={0.7}
            fill='black'
            strokeWidth={1 / scale}
            radius={8 / scale}
            onMouseEnter={setOnMouseEnter(cursor)}
            onMouseLeave={onMouseLeave}
        />
    )
}

export default ResizePoint