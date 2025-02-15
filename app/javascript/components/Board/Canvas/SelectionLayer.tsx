import React from 'react'
import { Layer, Rect } from 'react-konva'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'
import { CanvasObject, CanvasObjectType, XYWH } from '../../../Types/CanvasObjects'

const OPACITY = 0.7
const DASH_LENGTH = 10

function getXYWHfromArray(objects: CanvasObject[]): XYWH | null {
  if (objects.length === 0) return null
  
  let minX = Number.MAX_VALUE
  let minY = Number.MAX_VALUE
  let maxX = Number.MIN_VALUE
  let maxY = Number.MIN_VALUE

  objects.forEach(object => {
    switch (object.type) {
      case CanvasObjectType.Rectangle:
        minX = Math.min(minX, object.x)
        minY = Math.min(minY, object.y)
        maxX = Math.max(maxX, object.x + object.width)
        maxY = Math.max(maxY, object.y + object.height)
        break;

      case CanvasObjectType.Ellipse:
        minX = Math.min(minX, object.x - object.radiusX)
        minY = Math.min(minY, object.y - object.radiusY)
        maxX = Math.max(maxX, object.x + object.radiusX)
        maxY = Math.max(maxY, object.y + object.radiusY)
        break;

      case CanvasObjectType.Text:
        minX = Math.min(minX, object.x)
        minY = Math.min(minY, object.y)
        // TODO: додати правильну обробку розміру тексту
        maxX = Math.max(maxX, object.x + object.text.length * 10)
        maxY = Math.max(maxY, object.y + 10)
        break;

        case CanvasObjectType.Line:
          for (let i = 0; i < object.points.length; i += 2) {
            const pointX = object.points[i];
            const pointY = object.points[i + 1];
            minX = Math.min(minX, pointX);
            minY = Math.min(minY, pointY);
            maxX = Math.max(maxX, pointX);
            maxY = Math.max(maxY, pointY);
          }
          break;

        default:
          break;
        }
    });

    const width = maxX - minX;
    const height = maxY - minY;

    return {
        x: minX,
        y: minY,
        width: width,
        height: height,
    };
}

function getXYWH(canvasState: CanvasState): XYWH | null {

  switch (canvasState.mode) {
    case CanvasMode.Selected:
      if (canvasState.objects.length === 0) return null
      
      return getXYWHfromArray(canvasState.objects)
    
    case CanvasMode.SelectionNet:
      return {
        x: canvasState.origin.x,
        y: canvasState.origin.y,
        width: canvasState.current.x - canvasState.origin.x,
        height: canvasState.current.y - canvasState.origin.y,
      }

    default:
      return null
  }
}

type Props = {
  canvasState: CanvasState,
  scale: number
}

function SelectionLayer({canvasState, scale} : Props) {  
  const XYWH = getXYWH(canvasState)
  if (!XYWH) return null

  return (
    <Layer>
        <Rect
            x={XYWH.x}
            y={XYWH.y}
            width={XYWH.width}
            height={XYWH.height}
            fill='transparent'
            stroke='white'
            opacity={OPACITY}
            lineJoin='round'
            strokeWidth={1 / scale}
        />  
        <Rect
            x={XYWH.x}
            y={XYWH.y}
            width={XYWH.width}
            height={XYWH.height}
            fill='transparent'
            stroke='black'
            opacity={OPACITY}
            lineJoin='round'
            dash={[DASH_LENGTH / scale, DASH_LENGTH / scale]}
            strokeWidth={1 / scale}
        />
    </Layer>
  )
}

export default SelectionLayer