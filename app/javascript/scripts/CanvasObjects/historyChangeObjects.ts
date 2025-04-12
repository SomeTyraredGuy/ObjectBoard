import { CanvasMode, CanvasState } from "../../Types/Canvas";
import { CanvasObject, Ellipse, Rectangle, Text, Line, CanvasObjectType } from "../../Types/CanvasObjects";
import { HistoryRecord } from "../../Types/History";
import { setNoneMode, setSelectedMode } from "../canvasStateUtils";

export default function createHistoryChangeObjects(
	canvasObjects: CanvasObject[],
	setCanvasObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>,
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
	canvasState: CanvasState
) {
	return (historyRecord: HistoryRecord, redo: boolean = false) => {
		let newObjects: CanvasObject[] = [...canvasObjects];
		const newSelected: CanvasObject[] = [];
		let numOfDeleted = 0;
		const selectedMode = canvasState.mode === CanvasMode.Selected;

		historyRecord.forEach((changeRecord) => {
			const nextProps: Partial<CanvasObject> = redo ? changeRecord.newProperties : changeRecord.oldProperties;
			const prevProps: Partial<CanvasObject> = redo ? changeRecord.oldProperties : changeRecord.newProperties;

			if (nextProps === null) {
				// delete
				numOfDeleted++;
				return;
			} else if (prevProps === null) {
				// add
				newObjects[nextProps.index] = nextProps as CanvasObject;
				return;
			}

			let newObj = { ...canvasObjects.find((obj) => obj.id === changeRecord.id) };

			switch (newObj.type) {
				case CanvasObjectType.Rectangle:
					newObj = {
						...newObj,
						...(nextProps as Partial<Rectangle>),
					};
					break;
				case CanvasObjectType.Ellipse:
					newObj = {
						...newObj,
						...(nextProps as Partial<Ellipse>),
					};
					break;
				case CanvasObjectType.Text:
					newObj = {
						...newObj,
						...(nextProps as Partial<Text>),
					};
					break;
				case CanvasObjectType.Line:
					newObj = {
						...newObj,
						...(nextProps as Partial<Line>),
					};
					break;
			}

			newObjects[newObj.index] = newObj;
			if (selectedMode && canvasState.objects.findIndex((obj) => obj.id === changeRecord.id) !== -1) {
				newSelected.push(newObj);
			}
		});

		newObjects = newObjects.slice(0, newObjects.length - numOfDeleted);
		setCanvasObjects(newObjects);

		if (selectedMode) {
			if (newSelected.length === 0) setNoneMode(setCanvasState);
			else setSelectedMode(setCanvasState, newSelected);
		}
	};
}
