import { useQuery } from "@tanstack/react-query";
import { getBaseURL } from "../../../scripts/requestUtils";
import { CanvasObject } from "../../../Types/CanvasObjects";
import { useEffect } from "react";
import { CanvasStateUtils } from "../../../Types/CanvasStateUtils";

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
	} = useQuery({
		queryKey: ["canvasContent"],
		queryFn: async () => {
			const JSON = await fetch(`${getBaseURL()}/content/get`);
			const response = await JSON.json();

			if (!JSON.ok) {
				if (response.error) throw new Error(response.error);
				throw new Error();
			}

			return response;
		},
		refetchInterval: false,
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
