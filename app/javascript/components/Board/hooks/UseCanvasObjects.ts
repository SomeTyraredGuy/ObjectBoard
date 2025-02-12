import { useRef, useState } from 'react'
import { CanvasObject, CanvasObjectType, Point, Size } from '../../../Types/CanvasObjects'
import { KonvaEventObject } from 'konva/lib/Node'
import { getCursorOnCanvas } from '../Canvas/getters'
import { CanvasMode } from '../../../Types/Canvas'

function isTooSmallDrag(startingPoint: Point, currentPoint: Point, xRight: boolean, yBottom: boolean): boolean{
    if(!xRight && startingPoint.x - currentPoint.x > 5) return false
    if(xRight && currentPoint.x - startingPoint.x > 5) return false
    if(yBottom && currentPoint.y - startingPoint.y > 5) return false
    if(!yBottom && startingPoint.y - currentPoint.y > 5 ) return false

    return true
}

function setNewObjectProperties(objectType: CanvasObjectType, startingPoint: Point, currentPoint: Point, canvasObjects: CanvasObject[]): CanvasObject {
    const CommonObjectProps = {
        id: (canvasObjects.length+1).toString(),
        selected: true,
        locked: false,
    }

    const xRight = currentPoint.x > startingPoint.x
    const yBottom = currentPoint.y < startingPoint.y
    const isTooSmall = isTooSmallDrag(startingPoint, currentPoint, xRight, yBottom)
    switch (objectType) {
        case CanvasObjectType.Rectangle:
            let width: number, height: number
            if( isTooSmall ) {
                width = 100
                height = 100
            } else {
                width = xRight ? startingPoint.x - currentPoint.x : currentPoint.x - startingPoint.x
                height = yBottom ? startingPoint.y - currentPoint.y : currentPoint.y - startingPoint.y
            }

            return {
                ...CommonObjectProps,
                type: objectType,
                x: xRight ? currentPoint.x : startingPoint.x,
                y: yBottom ? currentPoint.y : startingPoint.y,
                width: width,
                height: height,
            }
        case CanvasObjectType.Ellipse:
            const center: Point = {
                x: (currentPoint.x + startingPoint.x) / 2,
                y: (currentPoint.y + startingPoint.y) / 2
            }
            let radiusX: number, radiusY: number
            if( isTooSmall ) {
                radiusX = 50
                radiusY = 50
            } else {
                radiusX = xRight ? currentPoint.x - center.x : center.x - currentPoint.x
                radiusY = yBottom ? currentPoint.y - center.y : center.y - currentPoint.y
            }

            return {
                ...CommonObjectProps,
                type: objectType,
                x: center.x,
                y: center.y,
                radiusX: radiusX,
                radiusY: radiusY
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
            const lineTo : Point = isTooSmall ? 
                {x: currentPoint.x + 100, y: currentPoint.y} : {x: startingPoint.x, y: startingPoint.y}

            return {
                ...CommonObjectProps,
                type: objectType,
                points: [currentPoint.x, currentPoint.y, lineTo.x, lineTo.y],
                stroke: 'red',
         }
    }
}

export default function UseCanvasObjects({canvasState, setCanvasState, stageScale}) {
    const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([])

    const startingPoint = useRef<Point>({x: 0, y: 0})
    const mouseDown = useRef(false)

    function onMouseDown(e: KonvaEventObject<MouseEvent>) {
        if (e.evt.button !== 0) {
            return;
        }

        const cursorPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
        if (!cursorPoint) return
        startingPoint.current = cursorPoint

        if( canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Selected ) {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin: cursorPoint,
            })
        }
        

        mouseDown.current = true
    }

    function onMouseMove(e: KonvaEventObject<MouseEvent>) {
        if (!mouseDown.current) return
        e.evt.preventDefault()
        
        if (canvasState.mode === CanvasMode.SelectionNet) {

            const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
            if (!currentPoint) return

            setCanvasState({
                ...canvasState,
                current: currentPoint,
            })

        }
    }

    function onMouseUp(e: KonvaEventObject<MouseEvent>) {
        if (e.evt.button !== 0) {
            return;
        }
        e.evt.preventDefault()

        const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale)
        if (!currentPoint){
            return
        }

        switch (canvasState.mode) {
            case 'Inserting':
                if(!startingPoint) return

                setCanvasObjects([ 
                    ...canvasObjects, 
                    setNewObjectProperties(
                        canvasState.objectType, 
                        startingPoint.current, 
                        currentPoint,
                        canvasObjects
                    )
                ])
                break
            case CanvasMode.SelectionNet:
                setCanvasState({
                    mode: CanvasMode.None,
                })
                break
        }
        mouseDown.current = false
    }

    return { canvasObjects, onMouseDown, onMouseMove, onMouseUp }
}