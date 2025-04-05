import React from 'react'
import { CanvasObject, CanvasObjectType } from '../../../Types/CanvasObjects'
import { Ellipse, Rect, Text, Line } from 'react-konva'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'
import { KonvaEventObject } from 'konva/lib/Node'

type Props = {
  objectsBlocked: boolean,
  canvasObjects: CanvasObject[],
  temporaryObject: CanvasObject | null,
  setCanvasState: React.Dispatch<React.SetStateAction<any>>,
  canvasState: CanvasState
}

function Objects({objectsBlocked, canvasObjects, temporaryObject, setCanvasState, canvasState}: Props) {

  function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
    if (objectsBlocked) return

    const stage = e.target.getStage()
    if (!stage) return
    stage.container().style.cursor = "move"
  }
  
  function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
    if (objectsBlocked) return

    const stage = e.target.getStage()
    if (!stage) return
    stage.container().style.cursor = "default";
  }
  
  function onMouseDown(e: KonvaEventObject<MouseEvent>, setCanvasState, canvasState, object: CanvasObject) {
    if (objectsBlocked) return
    if (canvasState.mode !== CanvasMode.Selected && canvasState.mode !== CanvasMode.None) return
  
    e.evt.preventDefault()
  
    if (canvasState.mode === CanvasMode.Selected && e.evt.ctrlKey) {
        setCanvasState({
            ...canvasState,
            objects: [ ...canvasState.objects, object ],
        })
        return
    }
  
    setCanvasState({
        mode: CanvasMode.Selected,
        objects: [object],
    })
  }

  function renderObject(object: CanvasObject, i?: number) {
    const commonProps = {
      key: object.id ? object.id : i,
      stroke: object.stroke ? object.stroke : "none",
      strokeWidth: object.strokeWidth,
      opacity: object.opacity,

      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,

      onMouseDown: (e) => onMouseDown(e, setCanvasState, canvasState, object),
    }

    switch (object.type) {
      case CanvasObjectType.Rectangle:
        return <Rect 
          {...commonProps} 
          x={object.x}
          y={object.y}
          width={object.width} 
          height={object.height} 
          fill={object.fill}
          cornerRadius={ object.width * object.cornerRadius}
        />

      case CanvasObjectType.Ellipse:
        return <Ellipse 
          {...commonProps} 
          x={object.x}
          y={object.y}
          radiusX={object.radiusX} 
          radiusY={object.radiusY} 
          fill={object.fill}
        />

      case CanvasObjectType.Text:
        return <Text
          {...commonProps} 
          x={object.x}
          y={object.y}
          text={object.text} 
          fill={object.fill}
        />

      case CanvasObjectType.Line:
        return <Line  
          {...commonProps} 
          points={object.points} 
        />
    }
  }

  return (
    <>
      {canvasObjects.map((object, i) => {
        return renderObject(object, i)
      })}

      { temporaryObject && renderObject(temporaryObject, -1) }
    </>
  )
}

export default Objects