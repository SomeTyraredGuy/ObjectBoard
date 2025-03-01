import { useState } from "react"
import { CanvasObject, CanvasObjectType, Point } from "../../../../../../Types/CanvasObjects"
import { CanvasState, CanvasMode } from "../../../../../../Types/Canvas"
import { getResizedByPercent, resizeRectangle, resizeEllipse, resizeLine, resizeText } from "../../resize"

export type ChangeObjectProperty = {
    propertyName: "fill",
    newValue: string,
}
| {
    propertyName: "stroke",
    newValue: string,
}

type Props = {
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>
}

export default function UseObjects({canvasState, setCanvasState}: Props) {
    const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([])
    
    function addNewObject(object: CanvasObject){
        object.index = canvasObjects.length
    
        setCanvasObjects([ 
            ...canvasObjects,
            object,
        ])
    }
    
    function moveSelectedObjects(moveBy: Point) {
        if (canvasState.mode !== CanvasMode.Selected) return
    
        let newObjects = [...canvasObjects]
        let newSelected: CanvasObject[] = []
    
        canvasState.objects.forEach( obj => {
            if (obj.index === undefined) return
    
            let newObject = {...obj}
            if (newObject.type === CanvasObjectType.Line){
                newObject.points = newObject.points.map((point, i) => {
                    if (i % 2 === 0) return point + moveBy.x
                    return point + moveBy.y
                })
            } else{
                newObject.x += moveBy.x
                newObject.y += moveBy.y
            }
    
            newObjects[obj.index] = newObject
            newSelected.push(newObject)
        })
    
        setCanvasState({
            ...canvasState,
            objects: newSelected,
            movedBy: moveBy,
        })
    
        setCanvasObjects(newObjects)
    }

    function moveLinePoint(moveBy: Point, final = false) {
        if (canvasState.mode !== CanvasMode.Selected || 
            canvasState.lineModification === undefined ||
            canvasState.objects.length !== 1 // assumes that line is only one selected object
        ) return
        
        let line = canvasState.objects[0]
        if (!line || line.index === undefined) return
        
        line = canvasObjects[line.index]
        if (!line || line.index === undefined || line.type !== CanvasObjectType.Line) return
        
        const xIndex = canvasState.lineModification.pointIndex * 2
        let points = [...line.points]
        points[xIndex] = points[xIndex] + moveBy.x
        points[xIndex + 1] = points[xIndex + 1] + moveBy.y

        let newObjects = [...canvasObjects]
        newObjects[line.index] = {...line, points: points}

        if (final) {
            setCanvasState({
                ...canvasState,
                objects: [newObjects[line.index]],
                lineModification: undefined,
            })
        } else{
            setCanvasState({
                ...canvasState,
                objects: [newObjects[line.index]],
            })
        }

        setCanvasObjects(newObjects)
    }

    function resizeSelectedObjects(currentPoint: Point, final = false) {
        if (canvasState.mode !== CanvasMode.Selected || !canvasState.resizing) return
        
        const side = canvasState.resizing.side
        const initialSelectedObjects = canvasState.resizing.initialSelectedObjects
        const initialSelectionNet = canvasState.resizing.initialSelectionNet
        const resizedByPercent = getResizedByPercent(side, currentPoint, initialSelectionNet)

        let newObjects = [...canvasObjects]
        let newSelected: CanvasObject[] = []
    
        canvasState.objects.forEach( (obj, i) => {
            if (obj.index === undefined) return
    
            let newObject = {...obj}
            switch (newObject.type) {
                case CanvasObjectType.Line:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Line) return
                    resizeLine(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
                    break
                    
                case CanvasObjectType.Rectangle:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Rectangle) return
                    resizeRectangle(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
                    break

                case CanvasObjectType.Ellipse:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Ellipse) return
                    resizeEllipse(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
                    break

                case CanvasObjectType.Text:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Text) return
                    resizeText(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
                    break

                default:
                    return
            }
    
            newObjects[obj.index] = newObject
            newSelected.push(newObject)
        })
    
        setCanvasObjects(newObjects)

        if (final) {
            setCanvasState({
                ...canvasState,
                objects: newSelected,
                resizing: undefined,
            })
        } else{
            setCanvasState({
                ...canvasState,
                objects: newSelected,
            })
        }
    }

    function changeProperty({propertyName,newValue}: ChangeObjectProperty) {
        if (canvasState.mode !== CanvasMode.Selected) return
        
        let newObjects = [...canvasObjects]
        let newSelected: CanvasObject[] = []
        
        canvasState.objects.forEach( obj => {
            if (obj.index === undefined ||
                obj.type === CanvasObjectType.Line && propertyName === "fill"
            ) return
    
            let newObject = {
                ...obj,
                [propertyName]: newValue,
            }
            newObjects[obj.index] = newObject
            newSelected.push(newObject)
        })
    
        setCanvasObjects(newObjects)

        setCanvasState({
            ...canvasState,
            objects: newSelected,
        })
    }

    return { 
        canvasObjects,
        addNewObject, 
        moveSelectedObjects,
        moveLinePoint,
        resizeSelectedObjects,
        resourcesProperties: {
            changeProperty
        }
    }
}