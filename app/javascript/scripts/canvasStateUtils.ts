import { CanvasMode, CanvasState } from "../Types/Canvas";
import { CanvasObject, Point } from "../Types/CanvasObjects";

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

export function setSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	canvasObjects: CanvasObject[]
) {
	setCanvasState({
		mode: CanvasMode.Selected,
		objects: canvasObjects,
	});
}

export function updateSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	newSelected: CanvasObject[]
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			objects: newSelected,
		};
	});
}

export function moveSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	newSelected: CanvasObject[],
	moveBy: Point
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			objects: newSelected,
			movedBy: moveBy,
		};
	});
}

export function setNoneMode(setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>) {
	setCanvasState({
		mode: CanvasMode.None,
	});
}
