import { CanvasMode, CanvasState, LineModification, Resizing } from "../../Types/Canvas";
import { CanvasObject } from "../../Types/CanvasObjects";

export function setSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	canvasObjects: CanvasObject[],
) {
	setCanvasState({
		mode: CanvasMode.Selected,
		objects: canvasObjects,
	});
}

export function updateSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	newSelected: CanvasObject[],
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			objects: newSelected,
		};
	});
}

export function addToSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	newObject: CanvasObject,
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			objects: [...prev.objects, newObject],
		};
	});
}

export function moveSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	newSelected: CanvasObject[],
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			objects: newSelected,
		};
	});
}

export function modifyLineSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	lineModification: LineModification,
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			lineModification: lineModification,
		};
	});
}

export function resizeSelectedMode(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	resizing: Resizing,
) {
	setCanvasState((prev) => {
		if (prev.mode !== CanvasMode.Selected) return prev;

		return {
			...prev,
			resizing: resizing,
		};
	});
}
