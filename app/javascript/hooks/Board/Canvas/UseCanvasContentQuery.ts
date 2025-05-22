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

export default function UseCanvasContentQuery({ canvasStateUtils, setCanvasObjects, isContentMutationError }: Props) {
	const {
		data: canvasContent,
		isLoading,
		error,
		isError,
		refetch,
	} = UseCustomQuery({
		queryKey: ["canvasContent"],
		path: ROUTES.getCanvasContentApi(),
		refetchInterval: false,
		disableNotification: true,
	});

	useEffect(() => {
		if (isContentMutationError) refetch();
	}, [isContentMutationError]);

	useEffect(() => {
		if (canvasContent) {
			canvasStateUtils.None.set();
			if (canvasContent.objects) setCanvasObjects(canvasContent.objects.toSorted((a, b) => a.id - b.id));
		}
	}, [canvasContent]);

	return { isLoading, error, isError };
}
