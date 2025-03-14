import { RefObject, useRef, useState } from "react";
import { ChangeRecord, HistoryRecord } from "./UseHistory";
import useTimeout from "../../../../../hooks/UseTimeout";
import { useMutation } from "@tanstack/react-query";
import { BASE_BOARD_URL, getCSRFToken } from "../../../../../Data/constants";
import { CanvasObject, isCanvasObject } from "../../../../../Types/CanvasObjects";

type Props = {
    boardId: number,
    noChanges: (changeRecord: ChangeRecord) => boolean,
    changeObjects: RefObject<(HistoryRecord: HistoryRecord, useNewProp?: boolean) => void>,
}

export default function UseCanvasMutation({boardId, noChanges, changeObjects}: Props) {
    const unsavedRecord = useRef<HistoryRecord>([])
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
    const localIDs = useRef<number[]>([])

    function getJSONRecord() {

        let del: number[] = []
        let create: CanvasObject[] = []
        localIDs.current = []
        let update: {id: number, type: string, newProperties: Partial<CanvasObject>}[] = []

        unsavedRecord.current.forEach(record =>{
            if (record.newProperties === null) del.push(record.id)

            else if (
                record.oldProperties === null && 
                record.newProperties.id < 0 && 
                isCanvasObject(record.newProperties) ){
                    localIDs.current.push(record.newProperties.id)
                    create.push(record.newProperties)
            } 

            else update.push({
                id: record.id,
                type: record.type,
                newProperties: record.newProperties
            })
        })

        const recordToSend = {
            record:{
                create: create,
                delete: del,
                update: update
            }
        }

        unsavedRecord.current = []

        return JSON.stringify(recordToSend)
    }
    const {
        mutateAsync
    } = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BASE_BOARD_URL}${boardId}/content/save`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'X-CSRF-Token': getCSRFToken(),
                },
                body: getJSONRecord()
            })
    
            const resp = await response.json()
            if (!resp.assigned_IDs) {
              if (resp.user) throw new Error(resp.user[0]);
              if (resp.board) throw new Error(resp.board[0]);
              if (resp.role) throw new Error(resp.role[0]);
              throw new Error(resp.message)
            } else{
                changeObjects.current(
                    localIDs.current.map((id, i) => ({
                        id: id,
                        type: "assignID",
                        oldProperties: {id: id},
                        newProperties: {id: resp.assigned_IDs[i]}
                    })), true
                )
            }
        },
        onSuccess: () => {setUnsavedChanges(false)}
    })

    const {
        startTimeout,
        clearTimer: clearTimeout
    } = useTimeout({
        delay: 2000, // 2 seconds
        callback: () => {
            clearMaxTimeout()
            mutateAsync()
        }
    })

    const {
        startTimeout: startMaxTimeout,
        clearTimer: clearMaxTimeout

    } = useTimeout({
        delay: 15000, // 15 seconds
        callback: () => {
            clearTimeout()
            mutateAsync()
        }
    })

    function addChanges(changes: HistoryRecord) {
        if (unsavedRecord.current.length === 0) {
            unsavedRecord.current = changes
            startMaxTimeout()
        }
        else {
            changes.forEach(change => {
                const index = unsavedRecord.current.findIndex(c => c.id === change.id)
                
                if ( index === -1 ){
                    unsavedRecord.current.push(change)
                    return
                }

                unsavedRecord.current[index] = {
                    ...unsavedRecord.current[index],
                    newProperties: change.newProperties,
                }

                if ( noChanges(unsavedRecord.current[index]) ) {
                    unsavedRecord.current.splice(index, 1) // no need to send anything
                }
            })
        }

        if (unsavedRecord.current.length > 0) {
            setUnsavedChanges(true)
            startTimeout()
        } else setUnsavedChanges(false)
    }

    window.addEventListener("beforeunload", () => {
        if (!unsavedChanges) return
        
        clearTimeout()
        clearMaxTimeout()
        mutateAsync()
    });

    return {
        addChanges,
        unsavedChanges
    }
}