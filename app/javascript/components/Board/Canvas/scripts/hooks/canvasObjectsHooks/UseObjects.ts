import { RefObject, useState } from "react"
import { CanvasObject, CanvasObjectType, Point } from "../../../../../../Types/CanvasObjects"
import { CanvasState, CanvasMode } from "../../../../../../Types/Canvas"
import { getResizedByPercent, resizeRectangle, resizeEllipse, resizeLine, resizeText } from "../../resize"
import { ChangeRecord, HistoryRecord } from "../UseHistory"

export type ChangeObjectProperty = {
    propertyName: "fill",
    newValue: string,
}
| {
    propertyName: "stroke",
    newValue: string,
}
| {
    propertyName: "strokeWidth",
    newValue: number,
}
| {
    propertyName: "opacity",
    newValue: number,
}
| {
    propertyName: "cornerRadius",
    newValue: number,
}

type Props = {
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    handleHistory: {
        changeObjects: RefObject<(HistoryRecord: HistoryRecord, useNewProp?: boolean) => void>,
        historyHandleChanges: (record: HistoryRecord, waitForFinal?: boolean) => void,
    }
}

export default function UseObjects({canvasState, setCanvasState, handleHistory}: Props) {
    const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([])
    const {
        changeObjects: historyChangeObjects,
        historyHandleChanges,
    } = handleHistory

    historyChangeObjects.current = (historyRecord: HistoryRecord, redo: boolean = false) => {
        let newObjects: CanvasObject[] = [...canvasObjects]
        let newSelected: CanvasObject[] = []
        let numOfDeleted = 0
        const selectedMode = canvasState.mode === CanvasMode.Selected
        
        historyRecord.forEach( changeRecord => {
            const nextProps: Partial<CanvasObject> = redo ? changeRecord.newProperties : changeRecord.oldProperties
            const prevProps: Partial<CanvasObject> = redo ? changeRecord.oldProperties : changeRecord.newProperties

            if ( nextProps === null ){ // delete
                numOfDeleted++
                return 
            } 
            else if ( prevProps === null ) { // add
                newObjects[nextProps.index] = nextProps as CanvasObject
                return
            }

            const obj = canvasObjects.find(obj => obj.id === changeRecord.id)

            const newObj: CanvasObject = {
                ...obj,
                ...nextProps as any,
            }

            newObjects[newObj.index] = newObj
            if (selectedMode && canvasState.objects.findIndex(obj => obj.id === changeRecord.id) !== -1){
                newSelected.push(newObj)
            }
        })
    
        newObjects = newObjects.slice(0, newObjects.length - numOfDeleted)
        setCanvasObjects(newObjects)

        if ( selectedMode ){
            if (newSelected.length === 0){
                setCanvasState({
                    mode: CanvasMode.None
                })
            }
            else setCanvasState({
                ...canvasState,
                objects: newSelected,
            })
        }
    }
    
    function addNewObject(object: CanvasObject){
        object.index = canvasObjects.length
    
        setCanvasObjects([ 
            ...canvasObjects,
            object,
        ])

        historyHandleChanges(
            [{
                id: object.id,
                oldProperties: null,
                newProperties: object,
            }],
        )
    }

    function deleteSelectedObjects() {
        if (canvasState.mode !== CanvasMode.Selected) return

        let newIndex = 0
        let newHistoryRecord: HistoryRecord = []
        const newObjects = canvasObjects.filter(obj => {
            if (canvasState.objects.includes(obj)){
                const changeRecord: ChangeRecord = {
                    id: obj.id,
                    newProperties: null,
                    oldProperties: obj,
                }
                newHistoryRecord.push(changeRecord)
                return false
            }

            if (obj.index !== newIndex) {
                const changeRecord: ChangeRecord = {
                    id: obj.id,
                    oldProperties: {index: obj.index},
                    newProperties: {index: newIndex},
                }
                newHistoryRecord.push(changeRecord)
                obj.index = newIndex
            }
            
            newIndex++
            return true
        })

        setCanvasObjects(newObjects)
        setCanvasState({
            mode: CanvasMode.None
        })
        historyHandleChanges(newHistoryRecord)
    }
    
    function moveSelectedObjects(moveBy: Point) {
        if (canvasState.mode !== CanvasMode.Selected) return
    
        let newObjects = [...canvasObjects]
        let newSelected: CanvasObject[] = []
        let newHistoryRecord: HistoryRecord = []
    
        canvasState.objects.forEach( obj => {
            if (obj.index === undefined) return
            
            let newObject = {...obj}
            let changeRecord: ChangeRecord = {
                id: newObject.id,
                oldProperties: null,
                newProperties: null
            }

            if (newObject.type === CanvasObjectType.Line){

                changeRecord.oldProperties= {points: newObject.points}

                newObject.points = newObject.points.map((point, i) => {
                    if (i % 2 === 0) return point + moveBy.x
                    return point + moveBy.y
                })

                changeRecord.newProperties= {points: newObject.points}
            } else{
                changeRecord.oldProperties= {x: newObject.x, y: newObject.y}

                newObject.x += moveBy.x
                newObject.y += moveBy.y

                changeRecord.newProperties= {x: newObject.x, y: newObject.y}
            }
    
            newObjects[obj.index] = newObject
            newSelected.push(newObject)
            newHistoryRecord.push(changeRecord)
        })
    
        setCanvasState({
            ...canvasState,
            objects: newSelected,
            movedBy: moveBy,
        })
    
        setCanvasObjects(newObjects)
        historyHandleChanges(newHistoryRecord, true)
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

        let changeRecord: ChangeRecord= {
            id: line.id,
            oldProperties: {points: line.points},
            newProperties: null
        }
        
        const xIndex = canvasState.lineModification.pointIndex * 2
        let points = [...line.points]
        points[xIndex] = points[xIndex] + moveBy.x
        points[xIndex + 1] = points[xIndex + 1] + moveBy.y

        let newObjects = [...canvasObjects]
        newObjects[line.index] = {...line, points: points}
        changeRecord.newProperties= {points: points}

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

        historyHandleChanges([changeRecord], true)
    }

    function resizeSelectedObjects(currentPoint: Point, final = false) {
        if (canvasState.mode !== CanvasMode.Selected || !canvasState.resizing) return
        
        const side = canvasState.resizing.side
        const initialSelectedObjects = canvasState.resizing.initialSelectedObjects
        const initialSelectionNet = canvasState.resizing.initialSelectionNet
        const resizedByPercent = getResizedByPercent(side, currentPoint, initialSelectionNet)

        let newObjects = [...canvasObjects]
        let newSelected: CanvasObject[] = []
    
        let historyRecord: HistoryRecord = []
        canvasState.objects.forEach( (obj, i) => {
            if (obj.index === undefined) return
    
            let changeRecord: ChangeRecord
            let newObject = {...obj}
            switch (newObject.type) {
                case CanvasObjectType.Line:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Line) return
                    changeRecord = resizeLine(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
                    break
                    
                case CanvasObjectType.Rectangle:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Rectangle) return
                    changeRecord = resizeRectangle(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
                    break

                case CanvasObjectType.Ellipse:
                    if (initialSelectedObjects[i].type !== CanvasObjectType.Ellipse) return
                    changeRecord = resizeEllipse(newObject, resizedByPercent, currentPoint, initialSelectionNet, initialSelectedObjects[i], side)
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
            historyRecord.push(changeRecord)
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

        historyHandleChanges(historyRecord, true)
    }

    function changeProperty({propertyName,newValue}: ChangeObjectProperty) {
        if (canvasState.mode !== CanvasMode.Selected) return
        
        let newObjects = [...canvasObjects]
        let newSelected: CanvasObject[] = []
        let newHistoryRecord: HistoryRecord = []
        
        canvasState.objects.forEach( obj => {
            if ( obj.index === undefined ) return
    
            let newObject = { ...obj }

            if ( propertyName in obj ){
                let newChangeRecord: ChangeRecord = {
                    id: newObject.id,
                    oldProperties: {[propertyName]: newObject[propertyName]},
                    newProperties: null
                }

                newObject = {
                    ...newObject,
                    [propertyName]: newValue,
                }

                newChangeRecord.newProperties= {[propertyName]: newValue}
                newHistoryRecord.push(newChangeRecord)
            }
            

            newObjects[obj.index] = newObject
            newSelected.push(newObject)
        })
    
        setCanvasObjects(newObjects)

        setCanvasState({
            ...canvasState,
            objects: newSelected,
        })

        historyHandleChanges(newHistoryRecord)
    }

    return { 
        canvasObjects,
        addNewObject, 
        moveSelectedObjects,
        moveLinePoint,
        resizeSelectedObjects,
        resourcesProperties: {
            changeProperty,
            deleteSelectedObjects
        }
    }
}