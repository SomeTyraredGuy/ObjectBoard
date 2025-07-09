import { useRef } from "react";
import { Point } from "../../../../Types/CanvasObjects";
import { KonvaEventObject } from "konva/lib/Node";
import { getCursorOnCanvas, isTooSmallDrag } from "../../../../scripts/canvasUtils";
import getOverlappingObjects from "../../../../scripts/CanvasObjects/getOverlappingObjects";
import { CanvasMode } from "../../../../Types/Canvas";
import UseObjects from "./UseObjects";
import UseTemporaryObject from "./UseTemporaryObject";
import { HistoryRecord } from "../../../../Types/History";
import { UseCanvasState } from "@/components/Board/CanvasStateContext";

type Props = {
	blocked: boolean;
	handleHistory: {
		removeAdditionalHistoryDelay: () => void;
		changeObjects: React.RefObject<() => void>;
		historyHandleChanges: (record: HistoryRecord, waitForFinal?: boolean) => void;
	};
};

export default function UseObjectsInteraction({ blocked, handleHistory }: Props) {
	const {
		canvasObjects,
		setCanvasObjects,
		addNewObject,
		moveSelectedObjects,
		moveSelectedLinePoint,
		resizeSelectedObjects,
		resourcesProperties,
	} = UseObjects({ handleHistory });
	const { temporaryObject, createTemporaryObject, updateTemporaryObject, deleteTemporaryObject } =
		UseTemporaryObject();
	const { removeAdditionalHistoryDelay } = handleHistory;
	const { canvasState, canvasStateUtils } = UseCanvasState();

	const startingPoint = useRef<Point>({ x: 0, y: 0 });
	const mouseDown = useRef(false);

	function clickedOnStage(e: KonvaEventObject<MouseEvent>) {
		return e.target.getType() === "Stage";
	}

	function onMouseDown(e: KonvaEventObject<MouseEvent>) {
		if (e.evt.button !== 0 || blocked) return;
		e.evt.preventDefault();

		const cursorPoint = getCursorOnCanvas(e.target.getStage());
		if (!cursorPoint) return;
		startingPoint.current = cursorPoint;

		switch (canvasState.mode) {
			case CanvasMode.None:
				if (!clickedOnStage(e)) break;

				canvasStateUtils.SelectionNet.set(cursorPoint);
				break;

			case CanvasMode.Inserting:
				createTemporaryObject();
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

		const currentPoint = getCursorOnCanvas(e.target.getStage());
		if (!currentPoint) return;
		switch (canvasState.mode) {
			case CanvasMode.SelectionNet:
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

		const currentPoint = getCursorOnCanvas(e.target.getStage());
		if (!currentPoint) return;

		switch (canvasState.mode) {
			case CanvasMode.Inserting: {
				if (!startingPoint.current || !temporaryObject) break;

				if (isTooSmallDrag(startingPoint.current, currentPoint)) break;

				addNewObject(temporaryObject);

				canvasStateUtils.Selected.set([temporaryObject]);
				break;
			}

			case CanvasMode.SelectionNet: {
				let overlappingObjects = getOverlappingObjects(canvasObjects, canvasState.origin, currentPoint);
				overlappingObjects = overlappingObjects.filter((obj) => !obj.locked);

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
