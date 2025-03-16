import { useRef } from 'react'
import { CanvasObjectType, Point } from '../../../../../../Types/CanvasObjects'
import { KonvaEventObject } from 'konva/lib/Node'
import { getCursorOnCanvas, getOverlappingObjects, isTooSmallDrag } from '../../getters'
import { CanvasMode, CanvasState } from '../../../../../../Types/Canvas'
import UseObjects from './UseObjects'
import UseTemporaryObject from './UseTemporaryObject'



type Props = {
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    stageScale: number,
    handleHistory: any,
}

export default function UseCanvasObjects({canvasState, setCanvasState, stageScale, handleHistory}: Props) {
    const { 
        canvasObjects,
        setCanvasObjects,
        addNewObject, 
        moveSelectedObjects ,
        moveLinePoint,
        resizeSelectedObjects,
        resourcesProperties
    } = UseObjects({canvasState, setCanvasState, handleHistory})
    const {
        temporaryObject,
        createTemporaryObject,
        updateTemporaryObject,
        deleteTemporaryObject,
    } = UseTemporaryObject({canvasState})
    const {
        removeAdditionalHistoryDelay
    } = handleHistory

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
                createTemporaryObject(cursorPoint)
                break

            case CanvasMode.Selected:
                if (e.target.getType() !== 'Stage') break
                // if clicked directly on the stage

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

                if (canvasState.resizing) {
                    resizeSelectedObjects(currentPoint)
                    break
                }

                const movedBy = {
                    x: currentPoint.x - startingPoint.current.x,
                    y: currentPoint.y - startingPoint.current.y,
                }

                if (canvasState.lineModification) {
                    moveLinePoint(movedBy)
                } else {
                    moveSelectedObjects(movedBy)
                }

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
            case CanvasMode.Inserting:
                const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                if( !currentPoint || 
                    !startingPoint.current || 
                    !temporaryObject ||
                    (temporaryObject.type !== CanvasObjectType.Text && isTooSmallDrag(startingPoint.current, currentPoint))
                ) break

                addNewObject(temporaryObject)

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

            case CanvasMode.Selected:
                if (canvasState.lineModification) {
                    moveLinePoint({x: 0, y: 0}, true)
                    break
                }

                if (canvasState.resizing) {
                    const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
                    if (!currentPoint) break
                    
                    resizeSelectedObjects(currentPoint, true)
                    break
                }
                break
        }

        deleteTemporaryObject()
        mouseDown.current = false

        removeAdditionalHistoryDelay() // for changes that happened while the mouse was down
    }

    return { 
        canvasObjects,
        setCanvasObjects,
        canvasUseObjectsInteraction: {
            temporaryObject,
            onMouseDown, 
            onMouseMove, 
            onMouseUp 
        },
        resourcesProperties
    }
}