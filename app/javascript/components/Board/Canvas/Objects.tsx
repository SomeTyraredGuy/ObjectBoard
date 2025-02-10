import React from 'react'
import { CanvasObject, CanvasObjectType } from '../../../Types/CanvasObjects'
import { Ellipse, Rect, Text, Line } from 'react-konva'

function Objects({canvasObjects}) {

  function renderObject(object: CanvasObject) {
    const commonProps = {
      key: object.id,
      x: object.x,
      y: object.y,
      draggable: true,
      fill: 'red',
    }

    switch (object.type) {
      case CanvasObjectType.Rectangle:
        return <Rect {...commonProps} width={object.width} height={object.height} />
      case CanvasObjectType.Ellipse:
        return <Ellipse {...commonProps} radiusX={object.radiusX} radiusY={object.radiusY} />
      case CanvasObjectType.Text:
        return <Text {...commonProps} text={object.text} />
      case CanvasObjectType.Line:
        return <Line  {...commonProps} points={object.points} stroke={object.stroke} />
    }
  }

  return (
    <>
      {canvasObjects.map((object) => {
        return renderObject(object)
      })}
    </>
  )
}

export default Objects