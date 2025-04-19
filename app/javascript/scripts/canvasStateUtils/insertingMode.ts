import { CanvasMode, CanvasState } from "../../Types/Canvas";
import { CanvasObject } from "../../Types/CanvasObjects";

export function setInsertingMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	startingProperties: CanvasObject
) {
	setCanvasState({
		mode: CanvasMode.Inserting,
		startingProperties: startingProperties,
	});
}

export function updatePropertyInsertingMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	propertyName: string,
	value: unknown
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Inserting) return prev;

		return {
			...prev,
			startingProperties: {
				...prev.startingProperties,
				[propertyName]: value
			  }
		};
	});
}