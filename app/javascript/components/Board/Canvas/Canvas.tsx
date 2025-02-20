import React from 'react'
import { Layer, Stage} from 'react-konva'
import UseStageScaleAndPosition from './scripts/hooks/UseStageScaleAndPosition'
import { KonvaEventObject } from 'konva/lib/Node'
import Objects from './Objects'
import UseObjectsInteraction from './scripts/hooks/canvasObjectsHooks/UseObjectsInteraction'
import SelectionLayer from './SelectionLayer'
import { CanvasMode } from '../../../Types/Canvas'

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
    temporaryObject,
    onMouseDown: onMouseDownUseObjects, 
    onMouseMove: onMouseMoveUseObjects,
    onMouseUp: onMouseUpUseObjects,
  } = UseObjectsInteraction({canvasState, setCanvasState, stageScale})

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
          temporaryObject={temporaryObject}
          setCanvasState={setCanvasState}
          canvasState={canvasState}
        />
      </Layer>

      { (canvasState.mode === CanvasMode.SelectionNet || canvasState.mode === CanvasMode.Selected) &&
        <SelectionLayer 
          canvasState={canvasState}
          scale={stageScale}
        />
      }
    </Stage>
  )
}

export default Canvas