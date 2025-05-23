import UseCustomQuery from "@/hooks/UseCustomQuery";
import { CanvasObject } from "../../../Types/CanvasObjects";
import { useEffect } from "react";
import { CanvasStateUtils } from "../../../Types/CanvasStateUtils";
import ROUTES from "@/routes";

type Props = {
	canvasStateUtils: CanvasStateUtils;
	setCanvasObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>;
	isContentMutationError: boolean;
};

export default function UseBoardContentQuery({ canvasStateUtils, setCanvasObjects, isContentMutationError }: Props) {
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

	useEffect(() => {
		if (isContentMutationError) refetch();
	}, [isContentMutationError]);

	useEffect(() => {
		if (boardContent) {
			canvasStateUtils.None.set();
			if (boardContent.objects) setCanvasObjects(boardContent.objects.toSorted((a, b) => a.id - b.id));
		}
	}, [boardContent]);

	return { isLoading, error, isError };
}
