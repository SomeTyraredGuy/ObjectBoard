import { useQuery } from "@tanstack/react-query";
import { getBaseURL } from "../../../scripts/requestUtils";
import { CanvasMode } from "../../../Types/Canvas";
import { CanvasObject } from "../../../Types/CanvasObjects";
import { CanvasState } from "../../../Types/Canvas";
import { useEffect } from "react";

type Props = {
    setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
    setCanvasObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>,
    isContentMutationError: boolean,
}

export default function useCanvasContentQuery({setCanvasState, setCanvasObjects, isContentMutationError}: Props) {
    const {
        data: canvasContent,
        isLoading,
        error,
        isError,
        refetch
      } = useQuery({
        queryKey: ['canvasContent'],
        queryFn: async () => {
            const JSON = await fetch(`${ getBaseURL() }/content/get`)
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