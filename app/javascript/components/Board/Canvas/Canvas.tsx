import React from 'react'
import { Layer, Stage} from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import Objects from './Objects'
import SelectionLayer from './SelectionLayer/SelectionLayer'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'
import { CanvasObject, Point } from '../../../Types/CanvasObjects'

type Props = {
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  canvasObjects: CanvasObject[],
  canvasUseObjects: {
    temporaryObject: CanvasObject | null,
    onMouseDown: (e: KonvaEventObject<MouseEvent>) => void,
    onMouseMove: (e: KonvaEventObject<MouseEvent>) => void,
    onMouseUp: (e: KonvaEventObject<MouseEvent>) => void,
  }
  canvasStageScaleAndPosition: {
    onWheel: (e: KonvaEventObject<MouseEvent>) => void,
    onMouseMove: (e: KonvaEventObject<MouseEvent>) => void,
    onMouseDown: (e: KonvaEventObject<MouseEvent>) => void,
    onMouseUp: (e: KonvaEventObject<MouseEvent>) => void,
    stagePosition: Point, 
    stageScale: number, 
    isDragging: boolean, 
  }
}

function Canvas({canvasState, setCanvasState, canvasObjects, canvasUseObjects, canvasStageScaleAndPosition}: Props) {

  const {
    temporaryObject,
    onMouseDown: onMouseDownUseObjects, 
    onMouseMove: onMouseMoveUseObjects,
    onMouseUp: onMouseUpUseObjects,
  } = canvasUseObjects  

  const { 
    onWheel, 
    onMouseMove: onMouseMoveUseScale,
    onMouseDown: onMouseDownUseScale, 
    onMouseUp: onMouseUpUseScale,
    stagePosition, 
    stageScale, 
    isDragging 
  } = canvasStageScaleAndPosition

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
          setCanvasState={setCanvasState}
          scale={stageScale}
        />
      }
    </Stage>
  )
}

export default Canvas