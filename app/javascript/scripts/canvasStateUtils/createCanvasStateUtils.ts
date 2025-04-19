import { CanvasState, LineModification, Resizing } from "../../Types/Canvas";
import { CanvasObject, Point } from "../../Types/CanvasObjects";
import { CanvasStateUtils } from "../../Types/CanvasStateUtils";
import { setInsertingMode, updatePropertyInsertingMode } from "./insertingMode";
import { setNoneMode } from "./noneMode";
import { addToSelectedMode, modifyLineSelectedMode, moveSelectedMode, resizeSelectedMode, setSelectedMode, updateSelectedMode } from "./selectedMode";
import { setSelectionNetMode, updateSelectionNetMode } from "./selectionNetMode";

export default function createCanvasStateUtils(
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>
): CanvasStateUtils {
	return {
		None: {
			set: () => setNoneMode(setCanvasState),
		},
		Selected: {
			set: (canvasObjects: CanvasObject[]) => setSelectedMode(setCanvasState, canvasObjects),
			update: (newSelected: CanvasObject[]) => updateSelectedMode(setCanvasState, newSelected),
			add: (newObject: CanvasObject) => addToSelectedMode(setCanvasState, newObject),
			move: (newSelected: CanvasObject[], moveBy: Point) => moveSelectedMode(setCanvasState, newSelected, moveBy),
			modifyLine: (lineModification: LineModification) => modifyLineSelectedMode(setCanvasState, lineModification),
			resize: (resizing: Resizing) => resizeSelectedMode(setCanvasState, resizing),
		},
		SelectionNet: {
			set: (startingPoint: Point) => setSelectionNetMode(setCanvasState, startingPoint),
			update: (currentPoint: Point) => updateSelectionNetMode(setCanvasState, currentPoint),
		},
		Inserting: {
			set: (startingProperties: CanvasObject) => setInsertingMode(setCanvasState, startingProperties),
			updateProperty: (property: string, value: unknown) => updatePropertyInsertingMode(setCanvasState, property, value),
		},
	};
}
