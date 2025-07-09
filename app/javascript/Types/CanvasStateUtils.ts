import { LineModification, Resizing } from "./Canvas";
import { CanvasObject, Point } from "./CanvasObjects";

export type CanvasStateUtils = {
	None: {
		set: () => void;
	};
	Selected: {
		set: (canvasObjects: CanvasObject[]) => void;
		update: (newSelected: CanvasObject[]) => void;
		add: (newObject: CanvasObject) => void;
		move: (newSelected: CanvasObject[]) => void;
		modifyLine: (lineModification: LineModification) => void;
		resize: (resizing: Resizing) => void;
	};
	SelectionNet: {
		set: (startingPoint: Point) => void;
	};
	Inserting: {
		set: (startingProperties: CanvasObject) => void;
		updateProperty: (property: string, value: unknown) => void;
	};
};
