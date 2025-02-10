import React from 'react'
import { Text, Layer, Stage, Line, Ellipse } from 'react-konva'
import UseStageScaleAndPosition from '../hooks/UseStageScaleAndPosition'
import { KonvaEventObject } from 'konva/lib/Node'
import Objects from './Objects'
import UseCanvasObjects from '../hooks/UseCanvasObjects'

function Canvas({canvasState, setCanvasState}) {

  const { 
    canvasObjects, 
    setCanvasObjects, 
    onClickCanvas 
  } = UseCanvasObjects({canvasState, setCanvasState})

  const { 
    onWheel, 
    onMouseMove, 
    onMouseDown, 
    onMouseUp, 
    stagePosition, 
    stageScale, 
    isDragging 
  } = UseStageScaleAndPosition()

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
    onClick={onClickCanvas}
    onContextMenu={(e: KonvaEventObject<MouseEvent>) => e.evt.preventDefault()}
    {...stagePosition}
    >
        <Layer>
          <Objects 
            canvasObjects={canvasObjects} 
          />
        </Layer>
    </Stage>
  )
}

export default Canvas