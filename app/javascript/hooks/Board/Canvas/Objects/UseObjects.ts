import { RefObject, useState } from "react";
import { CanvasObject, CanvasObjectType, Point, XYWH } from "../../../../Types/CanvasObjects";
import { CanvasMode, Side } from "../../../../Types/Canvas";
import {
	getResizedByPercent,
	resizeRectangle,
	resizeEllipse,
	resizeLine,
	// resizeText,
} from "../../../../scripts/CanvasObjects/resize";
import { HistoryRecord, ChangeRecord } from "../../../../Types/History";
import { ObjectPropertyChange } from "../../../../Types/ObjectPropertyChange";
import createHistoryChangeObjects from "../../../../scripts/CanvasObjects/historyChangeObjects";
import { creationChangeRecord, deletionChangeRecord, modificationChangeRecord } from "../../../../scripts/historyUtils";
import { moveLinePoint, moveObject } from "../../../../scripts/CanvasObjects/move";
import { UseCanvasState } from "@/components/Board/CanvasStateContext";

type Props = {
	handleHistory: {
		changeObjects: RefObject<(HistoryRecord: HistoryRecord, useNewProp?: boolean) => void>;
		historyHandleChanges: (record: HistoryRecord, waitForFinal?: boolean) => void;
	};
};

export default function UseObjects({ handleHistory }: Props) {
	const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([]);
	const { changeObjects: historyChangeObjects, historyHandleChanges } = handleHistory;
	const { canvasState, canvasStateUtils } = UseCanvasState();

	historyChangeObjects.current = createHistoryChangeObjects(
		canvasObjects,
		setCanvasObjects,
		canvasStateUtils,
		canvasState,
	);

	function addNewObject(object: CanvasObject) {
		object.index = canvasObjects.length;

		setCanvasObjects([...canvasObjects, object]);

		historyHandleChanges([creationChangeRecord(object)]);
	}

	function deleteSelectedObjects() {
		if (canvasState.mode !== CanvasMode.Selected) return;

		let newIndex = 0;
		const newHistoryRecord: HistoryRecord = [];
		const newObjects = canvasObjects.filter((obj) => {
			if (canvasState.objects.includes(obj)) {
				newHistoryRecord.push(deletionChangeRecord(obj));
				return false;
			}

			if (obj.index !== newIndex) {
				newHistoryRecord.push(modificationChangeRecord(obj, { index: newIndex }));
				obj.index = newIndex;
			}

			newIndex++;
			return true;
		});

		setCanvasObjects(newObjects);
		canvasStateUtils.None.set();
		historyHandleChanges(newHistoryRecord);
	}

	function moveSelectedObjects(moveBy: Point) {
		if (canvasState.mode !== CanvasMode.Selected) return;

		const newObjects = [...canvasObjects];
		const newSelected: CanvasObject[] = [];
		const newHistoryRecord: HistoryRecord = [];

		canvasState.objects.forEach((obj) => {
			if (obj.index === undefined) return;

			const newObject = { ...obj };

			if (!obj.locked) newHistoryRecord.push(moveObject(newObject, moveBy));
			newObjects[obj.index] = newObject;
			newSelected.push(newObject);
		});

		canvasStateUtils.Selected.move(newSelected);

		setCanvasObjects(newObjects);
		historyHandleChanges(newHistoryRecord, true);
	}

	function moveSelectedLinePoint(moveBy: Point, final = false) {
		if (
			canvasState.mode !== CanvasMode.Selected ||
			canvasState.lineModification === undefined ||
			canvasState.objects.length !== 1 // assumes that line is only one selected object
		)
			return;

		const lineIndex = canvasState.objects[0]?.index;
		if (lineIndex === undefined) return;

		const line = canvasObjects[lineIndex];
		if (!line || line.index === undefined || line.type !== CanvasObjectType.Line) return;

		const newLine = { ...line };

		if (!newLine.locked) historyHandleChanges([moveLinePoint(newLine, moveBy, canvasState.lineModification)], true);

		const newObjects = [...canvasObjects];
		newObjects[lineIndex] = newLine;

		if (final) {
			canvasStateUtils.Selected.set([newObjects[line.index]]);
		} else {
			canvasStateUtils.Selected.update([newObjects[line.index]]);
		}

		setCanvasObjects(newObjects);
	}

	function resizeSelectedObjects(currentPoint: Point, final = false) {
		if (canvasState.mode !== CanvasMode.Selected || !canvasState.resizing) return;

		const side = canvasState.resizing.side;
		const initialSelectedObjects = canvasState.resizing.initialSelectedObjects;
		const initialSelectionNet = canvasState.resizing.initialSelectionNet;
		const resizedByPercent = getResizedByPercent(side, currentPoint, initialSelectionNet);

		const newObjects = [...canvasObjects];
		const newSelected: CanvasObject[] = [];

		const historyRecord: HistoryRecord = [];
		canvasState.objects.forEach((obj, i) => {
			if (obj.index === undefined) return;

			const newObject = { ...obj };
			newObjects[obj.index] = newObject;
			newSelected.push(newObject);

			if (newObject.locked) return;

			let resizeFunc: (
				object: CanvasObject,
				resizedByPercent: Point,
				currentPoint: Point,
				initialSelectionNet: XYWH,
				initialObject: CanvasObject,
				side: Side,
			) => ChangeRecord;
			switch (newObject.type) {
				case CanvasObjectType.Line:
					if (initialSelectedObjects[i].type !== CanvasObjectType.Line) return;
					resizeFunc = resizeLine;
					break;

				case CanvasObjectType.Rectangle:
					if (initialSelectedObjects[i].type !== CanvasObjectType.Rectangle) return;
					resizeFunc = resizeRectangle;
					break;

				case CanvasObjectType.Ellipse:
					if (initialSelectedObjects[i].type !== CanvasObjectType.Ellipse) return;
					resizeFunc = resizeEllipse;
					break;

				case CanvasObjectType.Text:
					if (initialSelectedObjects[i].type !== CanvasObjectType.Text) return;
					resizeFunc = resizeRectangle;
					break;

				default:
					return;
			}

			historyRecord.push(
				resizeFunc(
					newObject,
					resizedByPercent,
					currentPoint,
					initialSelectionNet,
					initialSelectedObjects[i],
					side,
				),
			);
		});

		setCanvasObjects(newObjects);

		if (final) {
			canvasStateUtils.Selected.set(newSelected);
		} else {
			canvasStateUtils.Selected.update(newSelected);
		}

		historyHandleChanges(historyRecord, true);
	}

	function changeProperty({ propertyName, newValue }: ObjectPropertyChange) {
		if (canvasState.mode !== CanvasMode.Selected) return;

		const newObjects = [...canvasObjects];
		const newSelected: CanvasObject[] = [];
		const newHistoryRecord: HistoryRecord = [];

		canvasState.objects.forEach((obj) => {
			if (obj.index === undefined) return;

			let newObject = { ...obj };

			if (propertyName in obj) {
				newObject = {
					...newObject,
					[propertyName]: newValue,
				};

				newHistoryRecord.push(modificationChangeRecord(obj, { [propertyName]: newValue }));
			}

			newObjects[obj.index] = newObject;
			newSelected.push(newObject);
		});

		setCanvasObjects(newObjects);

		canvasStateUtils.Selected.set(newSelected);

		historyHandleChanges(newHistoryRecord);
	}

	return {
		canvasObjects,
		setCanvasObjects,
		addNewObject,
		moveSelectedObjects,
		moveSelectedLinePoint,
		resizeSelectedObjects,
		resourcesProperties: {
			changeProperty,
			deleteSelectedObjects,
		},
	};
}
