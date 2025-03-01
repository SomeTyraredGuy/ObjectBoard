import React from 'react'
import { CanvasObject, CanvasObjectType } from '../../../Types/CanvasObjects'
import { Ellipse, Rect, Text, Line } from 'react-konva'
import { CanvasMode } from '../../../Types/Canvas'
import { KonvaEventObject } from 'konva/lib/Node'

function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
  const stage = e.target.getStage()
  if (!stage) return
  stage.container().style.cursor = "move"
}

function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
  const stage = e.target.getStage()
  if (!stage) return
  stage.container().style.cursor = "default";
}

function onMouseDown(e: KonvaEventObject<MouseEvent>, setCanvasState, canvasState, object: CanvasObject) {
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

function Objects({canvasObjects, temporaryObject, setCanvasState, canvasState}) {

  function renderObject(object: CanvasObject, i?: number) {
    const commonProps = {
      key: object.id ? object.id : i,
      fill: object.type !== CanvasObjectType.Line && object.fill ? object.fill : "#2565db",
      stroke: object.stroke ? object.stroke : "none",

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
        />

      case CanvasObjectType.Ellipse:
        return <Ellipse 
          {...commonProps} 
          x={object.x}
          y={object.y}
          radiusX={object.radiusX} 
          radiusY={object.radiusY} 
        />

      case CanvasObjectType.Text:
        return <Text
          {...commonProps} 
          x={object.x}
          y={object.y}
          text={object.text} 
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