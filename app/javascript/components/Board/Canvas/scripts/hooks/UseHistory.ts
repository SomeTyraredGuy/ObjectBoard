import { RefObject, useRef } from "react"
import { CanvasState } from "../../../../../Types/Canvas"
import { CanvasObject } from "../../../../../Types/CanvasObjects"
import useTimeout from "../../../../../hooks/UseTimeout"
import UseCanvasMutation from "./UseCanvasMutation"

export type ChangeRecord = {
    id: number,
    oldProperties: Partial<CanvasObject>,
    newProperties: Partial<CanvasObject>,
}

export type HistoryRecord = ChangeRecord[]

type Props = {
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    changeObjects: RefObject<(HistoryRecord: HistoryRecord, useNewProp?: boolean) => void>,
    boardId: number,
}

export default function UseHistory({changeObjects, boardId}: Props) {
    const history = useRef<HistoryRecord[]>([])
    const historyIndex = useRef<number>(0) // points to the index for new record
    const delayedRecord = useRef<HistoryRecord>([])
    const additionalDelay = useRef<boolean>(false)
    function removeAdditionalDelay() {
        additionalDelay.current = false
    }

    const {
        addChanges: addToMutation,
        unsavedChanges
    } = UseCanvasMutation({boardId, noChanges})

    const {startTimeout} = useTimeout({
        delay: 200, 
        callback: () => {
            if(additionalDelay.current) {
                startTimeout()
                return
            }

            saveInHistory(delayedRecord.current)
            delayedRecord.current = []
        }
    })

    function historyHandleChanges(record: HistoryRecord, waitForFinal = false) {
        if (delayedRecord.current.length === 0) delayedRecord.current = record
        else {
            let newChangeRecords: ChangeRecord[] = []

            record.forEach(changeRecord => {
                const index = delayedRecord.current.findIndex(change => change.id === changeRecord.id)
                
                if ( index === -1 ){
                    newChangeRecords.push(changeRecord)
                    return
                }

                delayedRecord.current[index] = {
                    ...delayedRecord.current[index],
                    newProperties: changeRecord.newProperties,
                }

                if ( noChanges(delayedRecord.current[index]) ) {
                    delayedRecord.current.splice(index, 1)
                }
            })

            delayedRecord.current = [
                ...delayedRecord.current,
                ...newChangeRecords
            ]
        }

        additionalDelay.current = waitForFinal
        startTimeout()
    }

    function saveInHistory(record: HistoryRecord) {
        history.current = history.current.slice(0, historyIndex.current)
        history.current.push(
            copyHistoryRecord(record)
        )

        historyIndex.current++

        addToMutation(record)
    }

    function canUndo() {
        return historyIndex.current > 0
    }

    function undo() {
        if ( !canUndo() ) return

        historyIndex.current--
        const record = copyHistoryRecord(history.current[historyIndex.current])

        changeObjects.current(record)

        addToMutation(
            record.map(change => ({
                id: change.id,
                newProperties: change.oldProperties,
                oldProperties: change.newProperties
            }))
        )
    }

    function canRedo() {
        return historyIndex.current < history.current.length
    }

    function redo() {
        if ( !canRedo() ) return

        const record = copyHistoryRecord(history.current[historyIndex.current])
        historyIndex.current++

        changeObjects.current(record, true)

        addToMutation(record)
    }

    function noChanges(changeRecord: ChangeRecord): boolean {
        if (changeRecord.oldProperties === null && changeRecord.newProperties === null) return true
        if (changeRecord.oldProperties === null || changeRecord.newProperties === null) return false

        const oldKeys = Object.keys(changeRecord.oldProperties);
        const newKeys = Object.keys(changeRecord.newProperties);
    
        if (oldKeys.length !== newKeys.length) {
            return false;
        }
    
        for (const key of oldKeys) {
            if (changeRecord.oldProperties[key] !== changeRecord.newProperties[key]) {
                return false;
            }
        }
    
        return true;
    }

    function copyHistoryRecord(record: HistoryRecord) {
        return record.map(change => ({...change}))
    }

    return {
        historyHandleChanges,
        undo,
        canUndo,
        redo,
        canRedo,
        removeAdditionalDelay,
        unsavedChanges
    }
}