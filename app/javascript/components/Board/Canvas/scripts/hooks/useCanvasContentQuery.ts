import { useQuery } from "@tanstack/react-query";
import { BASE_BOARD_URL } from "../../../../../Data/constants";
import { CanvasMode } from "../../../../../Types/Canvas";
import { CanvasObject } from "../../../../../Types/CanvasObjects";
import { CanvasState } from "../../../../../Types/Canvas";
import { useEffect } from "react";

type Props = {
    boardId: number;
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    setCanvasObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>,
    isContentMutationError: boolean,
}

export default function useCanvasContentQuery({boardId, setCanvasState, setCanvasObjects, isContentMutationError}: Props) {
    const {
        data: canvasContent,
        isLoading,
        error,
        isError,
        refetch
      } = useQuery({
        queryKey: ['canvasContent', boardId],
        queryFn: async () => {
            const JSON = await fetch(`${BASE_BOARD_URL}${boardId}/content/get`)
            const response = await JSON.json()
                        
            if (!JSON.ok) {
                console.log(response)
                if (response.error) throw new Error(response.error)
                throw new Error()
            }
                        
            return response
        },
        refetchInterval: false
    })

    useEffect(() => {
        if (isContentMutationError) refetch()
    }, [isContentMutationError])

    useEffect(() => {
        if (canvasContent) {
            setCanvasState({
                mode: CanvasMode.None
            })
            if (canvasContent.objects) setCanvasObjects(canvasContent.objects.toSorted((a, b) => a.id - b.id))
        }
    }, [canvasContent])

  return { isLoading, error, isError };
}