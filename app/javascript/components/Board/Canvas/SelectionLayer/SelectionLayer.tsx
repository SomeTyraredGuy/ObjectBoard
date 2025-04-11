import React, { useRef } from 'react'
import { Layer, Rect } from 'react-konva'
import { CanvasMode, CanvasState, Side } from '../../../../Types/Canvas'
import { CanvasObject, CanvasObjectType, XYWH } from '../../../../Types/CanvasObjects'
import LineSelectionLayer from './LineSelectionLayer'
import ResizePoint from './ResizePoint'
import { onMouseEnter, onMouseLeave } from '../generalObjectsEventsHandlers'

const RESIZE_POINTS = [
  {
    side: Side.Top,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x + XYWH.width / 2,
        y: XYWH.y,
      }
    },
  },
  {
    side: Side.Bottom,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x + XYWH.width / 2,
        y: XYWH.y + XYWH.height,
      }
    },
  },
   {
    side: Side.Left,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x,
        y: XYWH.y + XYWH.height / 2,
      }
    },
  },
   {
    side: Side.Right,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x + XYWH.width,
        y: XYWH.y + XYWH.height / 2,
      }
    },
  },
  {
    side: Side.Top + Side.Left,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x,
        y: XYWH.y,
      }
    },
  },
  {
    side: Side.Top + Side.Right,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x + XYWH.width,
        y: XYWH.y,
      }
    },
  },
  {
    side: Side.Bottom + Side.Left,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x,
        y: XYWH.y + XYWH.height,
      }
    },
  },
    {
    side: Side.Bottom + Side.Right,
    calcPoint: (XYWH: XYWH) => {
      return {
        x: XYWH.x + XYWH.width,
        y: XYWH.y + XYWH.height,
      }
    },
  }
]

function getXYWHfromArray(objects: CanvasObject[]): XYWH | null {
  if (objects.length === 0) return null
  
  let minX = Number.MAX_VALUE
  let minY = Number.MAX_VALUE
  let maxX = -Number.MAX_VALUE
  let maxY = -Number.MAX_VALUE

  objects.forEach(object => {
    if (!object) return

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

function getXYWH(canvasState: CanvasState, currentXYWH: XYWH | null): XYWH | null {

  switch (canvasState.mode) {
    case CanvasMode.Selected:
      if (canvasState.objects.length === 0) return null

      if (canvasState.movedBy && currentXYWH) {
        const newXYWH = {
          x: currentXYWH.x + canvasState.movedBy.x,
          y: currentXYWH.y + canvasState.movedBy.y,
          width: currentXYWH.width,
          height: currentXYWH.height,
        }
        canvasState.movedBy = undefined
        return newXYWH
      }
      
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
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  scale: number
}

function SelectionLayer({canvasState, setCanvasState, scale} : Props) {
  if (  canvasState.mode === CanvasMode.Selected && 
        canvasState.objects.length === 1 &&
        canvasState.objects[0].type === CanvasObjectType.Line
  ){
    return (
        <LineSelectionLayer
          line={canvasState.objects[0]}
          scale={scale}
          canvasState={canvasState}
          setCanvasState={setCanvasState}
        />
    )
  }

  const XYWH = useRef<XYWH | null>(null)
  XYWH.current = getXYWH(canvasState, XYWH.current)
  if (!XYWH.current) return null

  const SELECTION_GENERAL_PROPERTIES = {
    x: XYWH.current.x,
    y: XYWH.current.y,
    width: XYWH.current.width,
    height: XYWH.current.height,
    fill: 'transparent',
    opacity: 0.7,
    strokeWidth: 1 / scale,
  }

  return (
    <Layer>
        <Rect
            stroke='white'
            lineJoin='round'
            {...SELECTION_GENERAL_PROPERTIES}
        />  
        <Rect
            stroke='black'
            lineJoin='round'
            dash={[10 / scale, 10 / scale]}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...SELECTION_GENERAL_PROPERTIES}
        />
        { canvasState.mode === CanvasMode.Selected &&
            <>
              {RESIZE_POINTS.map( (point, i) => {
                if (!XYWH.current) return null

                return (
                  <ResizePoint
                    point={point.calcPoint(XYWH.current)}
                    side={point.side}
                    scale={scale}
                    selectionNet={XYWH.current}
                    key={i}
                    canvasState={canvasState}
                    setCanvasState={setCanvasState}
                  />
                )
              })}
            </>
        }
    </Layer>
  )
}

export default SelectionLayer