import { CanvasMode, CanvasState } from "../../Types/Canvas";
import { Point } from "../../Types/CanvasObjects";

export function setSelectionNetMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	startingPoint: Point
) {
	setCanvasState({
		mode: CanvasMode.SelectionNet,
		origin: startingPoint,
		current: startingPoint,
	});
}

export function updateSelectionNetMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	currentPoint: Point
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.SelectionNet) return prev;

		return {
			...prev,
			current: currentPoint,
		};
	});
}
