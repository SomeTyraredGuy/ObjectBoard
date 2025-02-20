import { useState } from "react"
import { CanvasObject, CanvasObjectType, Point } from "../../../../../../Types/CanvasObjects"
import { getDirection } from "../../../getters"

function createNewObject(objectType: CanvasObjectType, currentPoint: Point): CanvasObject {
    const CommonObjectProps = {
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


export default function UseTemporaryObject() {
    const [temporaryObject, setTemporaryObject] = useState<CanvasObject | null>(null)

    function createTemporaryObject(objectType: CanvasObjectType, currentPoint: Point) {
        setTemporaryObject( createNewObject(objectType, currentPoint) )
    }

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

    function deleteTemporaryObject() {
        setTemporaryObject(null)
    }

    return {
        temporaryObject,
        createTemporaryObject,
        updateTemporaryObject,
        deleteTemporaryObject,
    }
}