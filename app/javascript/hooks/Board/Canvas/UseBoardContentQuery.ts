import UseCustomQuery from "@/hooks/UseCustomQuery";
import { CanvasObject } from "../../../Types/CanvasObjects";
import { useEffect, useRef } from "react";
import ROUTES from "@/routes";
import { UseCanvasState } from "@/components/Board/CanvasStateContext";

type Props = {
	setCanvasObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>;
	isContentMutationError: boolean;
};

export default function UseBoardContentQuery({ setCanvasObjects, isContentMutationError }: Props) {
	const { canvasStateUtils } = UseCanvasState();
	const {
		data: boardContent,
		isLoading,
		error,
		isError,
		refetch,
	} = UseCustomQuery({
		queryKey: ["boardContent"],
		path: ROUTES.getBoardContentApi(),
		refetchInterval: false,
		disableNotification: true,
	});

	const isPageUnloading = useRef(false);
	window.addEventListener("beforeunload", () => {
		isPageUnloading.current = true;
		setTimeout(() => {
			isPageUnloading.current = false;
		}, 1000);
	});

	useEffect(() => {
		if (isContentMutationError && !isPageUnloading.current) refetch();
	}, [isContentMutationError]);

	useEffect(() => {
		if (boardContent) {
			canvasStateUtils.None.set();
			if (boardContent.objects) setCanvasObjects(boardContent.objects.toSorted((a, b) => a.id - b.id));
		}
	}, [boardContent]);

	return { isLoading, error, isError };
}
