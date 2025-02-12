import React from 'react'
import { Text, Layer, Stage, Line, Ellipse } from 'react-konva'
import UseStageScaleAndPosition from '../hooks/UseStageScaleAndPosition'
import { KonvaEventObject } from 'konva/lib/Node'
import Objects from './Objects'
import UseCanvasObjects from '../hooks/UseCanvasObjects'
import SelectionLayer from './SelectionLayer'

function Canvas({canvasState, setCanvasState}) {

  const { 
    onWheel, 
    onMouseMove: onMouseMoveUseScale,
    onMouseDown: onMouseDownUseScale, 
    onMouseUp: onMouseUpUseScale,
    stagePosition, 
    stageScale, 
    isDragging 
  } = UseStageScaleAndPosition()

  const { 
    canvasObjects, 
    onMouseDown: onMouseDownUseObjects, 
    onMouseMove: onMouseMoveUseObjects,
    onMouseUp: onMouseUpUseObjects,
    selectionNet
  } = UseCanvasObjects({canvasState, setCanvasState, stageScale})

  return (
    <Stage
      className='bg-white'
      style={{cursor: isDragging ? "grab" : "default"}}
      width={window.innerWidth} height={window.innerHeight}
      scale={{x: stageScale, y: stageScale}}
      onWheel={onWheel}
      onMouseMove={(e) => {onMouseMoveUseScale(e); onMouseMoveUseObjects(e)}}
      onMouseDown={(e) => {onMouseDownUseScale(e); onMouseDownUseObjects(e)}}
      onMouseUp={(e) => {onMouseUpUseScale(e); onMouseUpUseObjects(e)}}
      onContextMenu={(e: KonvaEventObject<MouseEvent>) => e.evt.preventDefault()}
      {...stagePosition}
    >
      <Layer>
        <Objects 
          canvasObjects={canvasObjects} 
        />
      </Layer>

      <SelectionLayer 
        visible={selectionNet.isVisible}
        point={selectionNet.point}
        size={selectionNet.size}
        scale={stageScale}
      />
    </Stage>
  )
}

export default Canvas