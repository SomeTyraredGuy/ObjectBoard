import { useRef, useState } from 'react'
import { CanvasObject, CanvasObjectType, Point } from '../../../Types/CanvasObjects'
import { KonvaEventObject } from 'konva/lib/Node'
import { getCursorOnCanvas, getOverlappingObjects, getDirection, isTooSmallDrag } from '../Canvas/getters'
import { CanvasMode, CanvasState } from '../../../Types/Canvas'

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
                if (e.target.getType() !== 'Stage') break

                setCanvasState({
                    mode: CanvasMode.SelectionNet,
                    origin: cursorPoint,
                    current: cursorPoint,
                })
                break

            case CanvasMode.Inserting:
                setTemporaryObject( createNewObject(canvasState.objectType, (canvasObjects.length+1).toString(), cursorPoint) )
                break

            case CanvasMode.Selected:
                if (e.target.getType() !== 'Stage') break

                setCanvasState({
                    mode: CanvasMode.SelectionNet,
                    origin: cursorPoint,
                    current: cursorPoint,
                })
                break
        }

        mouseDown.current = true
    }

    function onMouseMove(e: KonvaEventObject<MouseEvent>) {
        if (!mouseDown.current) return
        e.evt.preventDefault()
        
        let currentPoint: Point | null
        switch (canvasState.mode) {
            case CanvasMode.SelectionNet:
                currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                if (!currentPoint) return

                setCanvasState({
                    ...canvasState,
                    current: currentPoint,
                })
                break
        
            case CanvasMode.Inserting:
                currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                if (!currentPoint) return

                updateTemporaryObject(
                    startingPoint.current, 
                    currentPoint,
                )
                break

            case CanvasMode.Selected:
                currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                if (!currentPoint) break
                const movedBy = {
                    x: currentPoint.x - startingPoint.current.x,
                    y: currentPoint.y - startingPoint.current.y,
                }

                canvasState.objects.forEach(object => {
                    if (object.type === CanvasObjectType.Line){
                        object.points = object.points.map((point, i) => {
                            if (i % 2 === 0) return point + movedBy.x
                            return point + movedBy.y
                        })
                    } else{
                        object.x += movedBy.x
                        object.y += movedBy.y
                    }
                })
                setCanvasState({
                    ...canvasState,
                    movedBy: movedBy,
                })

                startingPoint.current = currentPoint
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