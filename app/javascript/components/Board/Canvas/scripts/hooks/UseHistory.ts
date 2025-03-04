import { RefObject, useRef, useState } from "react"
import { CanvasState } from "../../../../../Types/Canvas"
import { CanvasObject } from "../../../../../Types/CanvasObjects"
import useTimeOut from "../../../../../hooks/UseTimeOut"

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
}

export default function UseHistory({changeObjects}: Props) {
    const [history, setHistory] = useState<HistoryRecord[]>([])
    const [historyIndex, setHistoryIndex] = useState<number>(0) // points to the index for new record
    const delayedRecord = useRef<HistoryRecord>([])
    const additionalDelay = useRef<boolean>(false)
    function removeAdditionalDelay() {
        additionalDelay.current = false
    }

    const startTimer = useTimeOut({
        delay: 200, 
        callback: () => {
            if(additionalDelay.current) {
                startTimer()
                return
            }

            saveRecord(delayedRecord.current)
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
            })

            delayedRecord.current = [
                ...delayedRecord.current,
                ...newChangeRecords
            ]
        }

        additionalDelay.current = waitForFinal
        startTimer()
    }

    function saveRecord(record: HistoryRecord) {
        setHistory([
            ...history.slice(0, historyIndex),
            record,
        ])
        setHistoryIndex( historyIndex + 1 )
    }

    function undo() {
        if (historyIndex === 0) return

        const record = history[historyIndex - 1]
        
        changeObjects.current(record)

        setHistoryIndex( historyIndex - 1 ) 
    }

    function redo() {
        if (historyIndex >= history.length) return

        const record = history[historyIndex]

        changeObjects.current(record, true)

        setHistoryIndex( historyIndex + 1 )
    }

    return {
        historyHandleChanges,
        undo,
        redo,
        removeAdditionalDelay
    }
}