import { useRef } from "react";
import { CanvasObjectType, Point } from "../../../../Types/CanvasObjects";
import { KonvaEventObject } from "konva/lib/Node";
import { getCursorOnCanvas, isTooSmallDrag } from "../../../../scripts/canvasUtils";
import getOverlappingObjects from "../../../../scripts/CanvasObjects/getOverlappingObjects";
import { CanvasMode, CanvasState } from "../../../../Types/Canvas";
import UseObjects from "./UseObjects";
import UseTemporaryObject from "./UseTemporaryObject";
import {
	setNoneMode,
	setSelectedMode,
	setSelectionNetMode,
	updateSelectionNetMode,
} from "../../../../scripts/canvasStateUtils";

type Props = {
	blocked: boolean;
	canvasState: CanvasState;
	setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
	stageScale: number;
	handleHistory: {
		removeAdditionalHistoryDelay: () => void;
		changeObjects: React.RefObject<() => void>;
		historyHandleChanges: () => void;
	};
};

export default function UseObjectsInteraction({
	blocked,
	canvasState,
	setCanvasState,
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
	} = UseObjects({ canvasState, setCanvasState, handleHistory });
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

				setSelectionNetMode(setCanvasState, cursorPoint);
				break;

			case CanvasMode.Inserting:
				createTemporaryObject(cursorPoint);
				break;

			case CanvasMode.Selected:
				if (!clickedOnStage(e)) break;

				setSelectionNetMode(setCanvasState, cursorPoint);
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
				updateSelectionNetMode(setCanvasState, currentPoint);
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

				setSelectedMode(setCanvasState, [temporaryObject]);
				break;
			}

			case CanvasMode.SelectionNet: {
				const overlappingObjects = getOverlappingObjects(canvasObjects, canvasState.origin, canvasState.current);

				if (overlappingObjects.length === 0) {
					setNoneMode(setCanvasState);
					break;
				}

				setSelectedMode(setCanvasState, overlappingObjects);
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
