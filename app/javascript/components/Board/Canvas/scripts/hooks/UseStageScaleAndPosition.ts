import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'

const SCALE_BOUNDS = {min: 0.1, max: 20}
const SCALE_BY = 1.1

const getLimitedScale = (scale: number, min: number, max: number) => Math.max(min, Math.min(scale, max))

export default function UseStageScaleAndPosition():{
    onWheel, 
    onMouseMove,
    onMouseDown, 
    onMouseUp,
    stagePosition, 
    stageScale, 
    isDragging
} {
    const [stagePosition, setStagePosition] = useState({x: 0, y: 0})
    const [stageScale, setStageScale] = useState(1)

    const onWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()
        const stage = e.target.getStage()
        if (!stage) return

        const oldScale = stage.scaleX()
        
        const pointerPosition = stage?.getPointerPosition()
        if (!pointerPosition) return

        const mousePointTo = {
            x: (pointerPosition.x - stage.x()) / oldScale,
            y: (pointerPosition.y - stage.y()) / oldScale,
        }
        
        const newScale = e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY

        const finalScale = getLimitedScale(
            newScale,
            SCALE_BOUNDS.min,
            SCALE_BOUNDS.max
        )

        setStageScale(finalScale)
        setStagePosition({
            x: pointerPosition.x - mousePointTo.x * finalScale,
            y: pointerPosition.y - mousePointTo.y * finalScale,
        })
    }

    const [isDragging, setIsDragging] = useState(false)

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.button !== 2) {
            return;
        }
        
        setIsDragging(true)
    }

    const onMouseUp = () => {
        setIsDragging(false)
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (!isDragging) return

        e.evt.preventDefault()
        const stage = e.target.getStage()
        if (!stage) return

        setStagePosition({
            x: stage.x() + e.evt.movementX,
            y: stage.y() + e.evt.movementY,
        })
    }
        
    return { onWheel, onMouseMove, onMouseDown, onMouseUp, stagePosition, stageScale, isDragging }
}