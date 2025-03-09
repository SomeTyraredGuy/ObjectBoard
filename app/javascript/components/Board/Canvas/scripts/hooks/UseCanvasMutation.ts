import { useRef, useState } from "react";
import { ChangeRecord, HistoryRecord } from "./UseHistory";
import useTimeout from "../../../../../hooks/UseTimeout";
import { useMutation } from "@tanstack/react-query";
import { BASE_BOARD_URL, getCSRFToken } from "../../../../../Data/constants";

type Props = {
    boardId: number,
    noChanges: (changeRecord: ChangeRecord) => boolean,
}

export default function UseCanvasMutation({boardId, noChanges}: Props) {
    const unsavedRecord = useRef<HistoryRecord>([])
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)

    function getJSONRecord() {

        const recordToSend = {
            changes: unsavedRecord.current.map(change => ({
                id: change.id,
                newProperties: change.newProperties
            })),
            board_id: boardId
        }

        unsavedRecord.current = []

        return JSON.stringify(recordToSend)
    }
    const {
        mutateAsync
    } = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${BASE_BOARD_URL}${boardId}/TODO`, {
                method: "PATCH",
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'X-CSRF-Token': getCSRFToken(),
                },
                body: getJSONRecord()
            })
    
            if (!response.ok) {
              const errorData = await response.json();
                
              if (errorData.user) throw new Error(errorData.user[0]);
              if (errorData.board) throw new Error(errorData.board[0]);
              if (errorData.role) throw new Error(errorData.role[0]);
              throw new Error(errorData.message)
            }
        },
        onSuccess: () => {setUnsavedChanges(false)}
    })

    const {
        startTimeout,
        clearTimer: clearTimeout
    } = useTimeout({
        delay: 50000, // 10 seconds
        callback: () => {
            clearMaxTimeout()
            mutateAsync()
        }
    })

    const {
        startTimeout: startMaxTimeout,
        clearTimer: clearMaxTimeout

    } = useTimeout({
        delay: 60000, // 1 minute
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