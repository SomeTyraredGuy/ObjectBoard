import { useRef, useState } from 'react'
import { CanvasObject, CanvasObjectType, Point } from '../../../Types/CanvasObjects'
import { KonvaEventObject } from 'konva/lib/Node'
import { getCursorOnCanvas, getOverlappingObjects, getDirection } from '../Canvas/getters'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'

function isTooSmallDrag(startingPoint: Point, currentPoint: Point): boolean{
    const { xRight, yBottom } = getDirection(startingPoint, currentPoint)

    if(!xRight && startingPoint.x - currentPoint.x > 5) return false
    if(xRight && currentPoint.x - startingPoint.x > 5) return false
    if(yBottom && currentPoint.y - startingPoint.y > 5) return false
    if(!yBottom && startingPoint.y - currentPoint.y > 5 ) return false

    return true
}

function createNewObject(objectType: CanvasObjectType, id: string, currentPoint: Point): CanvasObject {
    const CommonObjectProps = {
        id: id,
        selected: true,
        locked: false,
    }

    switch (objectType) {
        case CanvasObjectType.Rectangle:
            let width: number, height: number
            width = 0
            height = 0

            return {
                ...CommonObjectProps,
                type: objectType,
                x: 0,
                y: 0,
                width: width,
                height: height,
            }
        case CanvasObjectType.Ellipse:
            return {
                ...CommonObjectProps,
                type: objectType,
                x: 0,
                y: 0,
                radiusX: 0,
                radiusY: 0
            }
        case CanvasObjectType.Text:
            return {
                ...CommonObjectProps,
                x: currentPoint.x,
                y: currentPoint.y,
                type: objectType,
                text: 'Text',
            }
        case CanvasObjectType.Line:
            return {
                ...CommonObjectProps,
                type: objectType,
                points: [0, 0, 0, 0],
                stroke: 'red',
         }
    }
}

type Props = {
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    stageScale: number
}

export default function UseCanvasObjects({canvasState, setCanvasState, stageScale}: Props) {
    const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([])
    const [temporaryObject, setTemporaryObject] = useState<CanvasObject | null>(null)

    function updateTemporaryObject(startingPoint: Point, currentPoint: Point){
        if(!temporaryObject) return
        const { xRight, yBottom } = getDirection(startingPoint, currentPoint)
    
        switch (temporaryObject.type) {
            case CanvasObjectType.Rectangle:
                const width = xRight ? currentPoint.x - startingPoint.x : startingPoint.x - currentPoint.x
                const height = yBottom ? startingPoint.y - currentPoint.y : currentPoint.y - startingPoint.y
    
                setTemporaryObject({
                    ...temporaryObject,
                    x: xRight ? startingPoint.x : currentPoint.x,
                    y: yBottom ? currentPoint.y : startingPoint.y,
                    width: width,
                    height: height,
                })
                break
    
            case CanvasObjectType.Ellipse:
                const center: Point = {
                    x: (currentPoint.x + startingPoint.x) / 2,
                    y: (currentPoint.y + startingPoint.y) / 2
                }
                const radiusX = xRight ? currentPoint.x - center.x : center.x - currentPoint.x
                const radiusY = yBottom ? center.y - currentPoint.y : currentPoint.y - center.y
    
                setTemporaryObject({
                    ...temporaryObject,
                    x: center.x,
                    y: center.y,
                    radiusX: radiusX,
                    radiusY: radiusY
                })
                break
                
            case CanvasObjectType.Text:
                setTemporaryObject({
                    ...temporaryObject,
                    x: currentPoint.x,
                    y: currentPoint.y,
                })
                break
    
            case CanvasObjectType.Line:
                const lineTo : Point = {x: startingPoint.x, y: startingPoint.y}
    
                setTemporaryObject({
                    ...temporaryObject,
                    points: [currentPoint.x, currentPoint.y, lineTo.x, lineTo.y]
                })
                break
        }
    }

    const startingPoint = useRef<Point>({x: 0, y: 0})
    const mouseDown = useRef(false)

    function onMouseDown(e: KonvaEventObject<MouseEvent>) {
        if (e.evt.button !== 0) {
            return;
        }

        const cursorPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
        if (!cursorPoint) return
        startingPoint.current = cursorPoint

        switch (canvasState.mode) {
            case CanvasMode.None:
                setCanvasState({
                    mode: CanvasMode.SelectionNet,
                    origin: cursorPoint,
                    current: cursorPoint,
                })
                break

            case CanvasMode.Inserting:
                setTemporaryObject( createNewObject(canvasState.objectType, (canvasObjects.length+1).toString(), cursorPoint) )
                break
        }

        mouseDown.current = true
    }

    function onMouseMove(e: KonvaEventObject<MouseEvent>) {
        if (!mouseDown.current) return
        e.evt.preventDefault()

        const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                if (!currentPoint) return
        
        switch (canvasState.mode) {
            case CanvasMode.SelectionNet:

                setCanvasState({
                    ...canvasState,
                    current: currentPoint,
                })
                break
        
            case CanvasMode.Inserting:
                updateTemporaryObject(
                    startingPoint.current, 
                    currentPoint,
                )
                break

            default:
                break
        }
    }

    function onMouseUp(e: KonvaEventObject<MouseEvent>) {
        if (e.evt.button !== 0) {
            return;
        }
        e.evt.preventDefault()

        switch (canvasState.mode) {
            case 'Inserting':
                const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                if( !currentPoint || 
                    !startingPoint.current || 
                    !temporaryObject ||
                    (temporaryObject.type !== CanvasObjectType.Text && isTooSmallDrag(startingPoint.current, currentPoint))
                ) break

                setCanvasObjects([ 
                    ...canvasObjects,
                    temporaryObject,
                ])

                setCanvasState({
                    mode: CanvasMode.Selected,
                    objects: [temporaryObject],
                })
                break
                
            case CanvasMode.SelectionNet:
                const overlappingObjects = getOverlappingObjects(canvasObjects, canvasState.origin, canvasState.current)

                if (overlappingObjects.length === 0) {
                    setCanvasState({
                        mode: CanvasMode.None,
                    })
                    break
                }

                setCanvasState({
                    mode: CanvasMode.Selected,
                    objects: overlappingObjects,
                })
                break
        }

        setTemporaryObject(null)
        mouseDown.current = false
    }

    return { canvasObjects, temporaryObject, onMouseDown, onMouseMove, onMouseUp }
}