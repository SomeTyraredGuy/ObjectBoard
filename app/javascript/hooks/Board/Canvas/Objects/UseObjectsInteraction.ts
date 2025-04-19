import { useRef } from "react";
import { CanvasObjectType, Point } from "../../../../Types/CanvasObjects";
import { KonvaEventObject } from "konva/lib/Node";
import { getCursorOnCanvas, isTooSmallDrag } from "../../../../scripts/canvasUtils";
import getOverlappingObjects from "../../../../scripts/CanvasObjects/getOverlappingObjects";
import { CanvasMode, CanvasState } from "../../../../Types/Canvas";
import UseObjects from "./UseObjects";
import UseTemporaryObject from "./UseTemporaryObject";
import { CanvasStateUtils } from "../../../../Types/CanvasStateUtils";
import { HistoryRecord } from "../../../../Types/History";

type Props = {
	blocked: boolean;
	canvasState: CanvasState;
	canvasStateUtils: CanvasStateUtils;
	stageScale: number;
	handleHistory: {
		removeAdditionalHistoryDelay: () => void;
		changeObjects: React.RefObject<() => void>;
		historyHandleChanges: (record: HistoryRecord, waitForFinal?: boolean) => void;
	};
};

export default function UseObjectsInteraction({
	blocked,
	canvasState,
	canvasStateUtils,
	stageScale,
	handleHistory,
}: Props) {
	const {
		canvasObjects,
		setCanvasObjects,
		addNewObject,
		moveSelectedObjects,
		moveSelectedLinePoint,
		resizeSelectedObjects,
		resourcesProperties,
	} = UseObjects({ canvasState, canvasStateUtils, handleHistory });
	const { temporaryObject, createTemporaryObject, updateTemporaryObject, deleteTemporaryObject } = UseTemporaryObject({
		canvasState,
	});
	const { removeAdditionalHistoryDelay } = handleHistory;

	const startingPoint = useRef<Point>({ x: 0, y: 0 });
	const mouseDown = useRef(false);

	function clickedOnStage(e: KonvaEventObject<MouseEvent>) {
		return e.target.getType() === "Stage";
	}

	function onMouseDown(e: KonvaEventObject<MouseEvent>) {
		if (e.evt.button !== 0 || blocked) return;
		e.evt.preventDefault();

		const cursorPoint = getCursorOnCanvas(e.target.getStage(), stageScale);
		if (!cursorPoint) return;
		startingPoint.current = cursorPoint;

		switch (canvasState.mode) {
			case CanvasMode.None:
				if (!clickedOnStage(e)) break;

				canvasStateUtils.SelectionNet.set(cursorPoint);
				break;

			case CanvasMode.Inserting:
				createTemporaryObject(cursorPoint);
				break;

			case CanvasMode.Selected:
				if (!clickedOnStage(e)) break;

				canvasStateUtils.SelectionNet.set(cursorPoint);
				break;
		}

		mouseDown.current = true;
	}

	function onMouseMove(e: KonvaEventObject<MouseEvent>) {
		if (!mouseDown.current || blocked) return;
		e.evt.preventDefault();

		const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale);
		if (!currentPoint) return;
		switch (canvasState.mode) {
			case CanvasMode.SelectionNet:
				canvasStateUtils.SelectionNet.update(currentPoint);
				break;

			case CanvasMode.Inserting:
				updateTemporaryObject(startingPoint.current, currentPoint);
				break;

			case CanvasMode.Selected: {
				if (canvasState.resizing) {
					resizeSelectedObjects(currentPoint);
					break;
				}

				const movedBy = {
					x: currentPoint.x - startingPoint.current.x,
					y: currentPoint.y - startingPoint.current.y,
				};

				if (canvasState.lineModification) {
					moveSelectedLinePoint(movedBy);
				} else {
					moveSelectedObjects(movedBy);
				}

				startingPoint.current = currentPoint;
				break;
			}

			default:
				break;
		}
	}

	function onMouseUp(e: KonvaEventObject<MouseEvent>) {
		if (e.evt.button !== 0 || blocked) return;
		e.evt.preventDefault();

		switch (canvasState.mode) {
			case CanvasMode.Inserting: {
				const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale);
				if (!currentPoint || !startingPoint.current || !temporaryObject) break;

				if (temporaryObject.type !== CanvasObjectType.Text && isTooSmallDrag(startingPoint.current, currentPoint))
					break;

				addNewObject(temporaryObject);

				canvasStateUtils.Selected.set([temporaryObject]);
				break;
			}

			case CanvasMode.SelectionNet: {
				const overlappingObjects = getOverlappingObjects(canvasObjects, canvasState.origin, canvasState.current);

				if (overlappingObjects.length === 0) {
					canvasStateUtils.None.set();
					break;
				}

				canvasStateUtils.Selected.set(overlappingObjects);
				break;
			}

			case CanvasMode.Selected:
				if (canvasState.lineModification) {
					moveSelectedLinePoint({ x: 0, y: 0 }, true);
					break;
				}

				if (canvasState.resizing) {
					const currentPoint = getCursorOnCanvas(e.target.getStage(), stageScale);
					if (!currentPoint) break;

					resizeSelectedObjects(currentPoint, true);
					break;
				}
				break;
		}

		deleteTemporaryObject();
		mouseDown.current = false;

		removeAdditionalHistoryDelay();
	}

	return {
		canvasObjects,
		setCanvasObjects,
		canvasUseObjectsInteraction: {
			temporaryObject,
			onMouseDown,
			onMouseMove,
			onMouseUp,
		},
		resourcesProperties,
	};
}
