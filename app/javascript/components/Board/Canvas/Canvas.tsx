import React from 'react'
import { Circle, Layer, Rect, Stage } from 'react-konva'
import { CanvasMode } from '../../../Types/Canvas'
import UseStageScaleAndPosition from '../hooks/UseStageScaleAndPosition'
import { KonvaEventObject } from 'konva/lib/Node'

function Canvas({canvasState, setCanvasState}) {

  const { 
    onWheel, 
    onMouseMove, 
    onMouseDown, 
    onMouseUp, 
    stagePosition, 
    stageScale, 
    isDragging } = UseStageScaleAndPosition()

  return (
    <Stage 
    className='bg-white'
    style={{cursor: isDragging ? "grab" : "default"}}
    width={window.innerWidth} height={window.innerHeight}
    scale={{x: stageScale, y: stageScale}}
    onWheel={onWheel}
    onMouseMove={onMouseMove}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onContextMenu={(e: KonvaEventObject<MouseEvent>) => e.evt.preventDefault()}
    {...stagePosition}
    >
        <Layer>
            <Rect x={100} y={100} width={200} height={200} fill='blue' draggable={canvasState.mode === CanvasMode.None}/>
            <Circle x={200} y={200} radius={50} fill='red'/>
        </Layer>
    </Stage>
  )
}

export default Canvas