import { CanvasMode, CanvasState } from "../../Types/Canvas";
import { Point } from "../../Types/CanvasObjects";

export function setSelectionNetMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	startingPoint: Point,
) {
	setCanvasState({
		mode: CanvasMode.SelectionNet,
		origin: startingPoint,
	});
}
