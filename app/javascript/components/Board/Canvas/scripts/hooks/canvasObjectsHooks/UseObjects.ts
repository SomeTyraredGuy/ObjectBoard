import { useState } from "react"
import { CanvasObject, CanvasObjectType, Point } from "../../../../../../Types/CanvasObjects"
import { CanvasState, CanvasMode } from "../../../../../../Types/Canvas"


type Props = {
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    stageScale: number
}

export default function UseObjects({canvasState, setCanvasState, stageScale}: Props) {
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

    function moveLinePoint(pointIndex: number, moveBy: Point) {
        if (canvasState.mode !== CanvasMode.Selected || 
            canvasState.lineModification === undefined ||
            canvasState.objects.length !== 1 // assumes that line is only one selected object
        ) return
        
        let line = canvasState.objects[0]
        if (!line || line.index === undefined) return
        
        line = canvasObjects[line.index]
        if (!line || line.index === undefined || line.type !== CanvasObjectType.Line) return
        
        const xIndex = pointIndex * 2
        let points = [...line.points]
        points[xIndex] = points[xIndex] + moveBy.x
        points[xIndex + 1] = points[xIndex + 1] + moveBy.y

        let newObjects = [...canvasObjects]
        newObjects[line.index] = {...line, points: points}

        setCanvasState({
            ...canvasState,
            objects: [newObjects[line.index]],
        })

        setCanvasObjects(newObjects)
    }

    return { 
        canvasObjects,
        addNewObject, 
        moveSelectedObjects,
        moveLinePoint
    }
}