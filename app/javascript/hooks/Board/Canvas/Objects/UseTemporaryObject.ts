import { useRef, useState } from "react";
import { CanvasObject, CanvasObjectType, Point } from "../../../../Types/CanvasObjects";
import getDirection from "../../../../scripts/CanvasObjects/getDirection";
import { UseCanvasState } from "@/components/Board/CanvasStateContext";
import { CanvasMode } from "@/Types/Canvas";
import Konva from "konva";

export default function UseTemporaryObject() {
	const { canvasState } = UseCanvasState();
	const [temporaryObject, setTemporaryObject] = useState<CanvasObject | null>(null);
	const temporaryObjectRef = useRef<Konva.Ellipse | Konva.Rect | Konva.Text | Konva.Line | null>(null);

	function createNewObject(startingProperties: CanvasObject): CanvasObject {
		return {
			locked: false,
			ref: temporaryObjectRef,
			...startingProperties,
		};
	}

	function getNewProps(startingPoint: Point, currentPoint: Point) {
		const { xRight, yBottom } = getDirection(startingPoint, currentPoint);
		const width = xRight ? currentPoint.x - startingPoint.x : startingPoint.x - currentPoint.x;
		const height = yBottom ? startingPoint.y - currentPoint.y : currentPoint.y - startingPoint.y;

		switch (temporaryObject.type) {
			case CanvasObjectType.Rectangle: {
				return {
					x: xRight ? startingPoint.x : currentPoint.x,
					y: yBottom ? currentPoint.y : startingPoint.y,
					width: width,
					height: height,
				};
			}

			case CanvasObjectType.Ellipse: {
				const center: Point = {
					x: (currentPoint.x + startingPoint.x) / 2,
					y: (currentPoint.y + startingPoint.y) / 2,
				};
				const radiusX = xRight ? currentPoint.x - center.x : center.x - currentPoint.x;
				const radiusY = yBottom ? center.y - currentPoint.y : currentPoint.y - center.y;

				return {
					x: center.x,
					y: center.y,
					radiusX: radiusX,
					radiusY: radiusY,
				};
			}

			case CanvasObjectType.Text:
				return {
					x: xRight ? startingPoint.x : currentPoint.x,
					y: yBottom ? currentPoint.y : startingPoint.y,
					width: width,
					height: height,
				};

			case CanvasObjectType.Line: {
				const lineTo: Point = { x: startingPoint.x, y: startingPoint.y };

				return {
					points: [currentPoint.x, currentPoint.y, lineTo.x, lineTo.y],
				};
			}
		}
	}

	function getFinalTemporaryObject(startingPoint: Point, currentPoint: Point) {
		return {
			...temporaryObject,
			...getNewProps(startingPoint, currentPoint),
			ref: null,
		};
	}

	function createTemporaryObject() {
		if (canvasState.mode !== CanvasMode.Inserting) return;

		setTemporaryObject(createNewObject(canvasState.startingProperties));
	}

	function updateTemporaryObject(startingPoint: Point, currentPoint: Point) {
		if (!temporaryObject) return;

		temporaryObjectRef.current.setAttrs({
			...getNewProps(startingPoint, currentPoint),
		});
	}

	function deleteTemporaryObject() {
		setTemporaryObject(null);
	}

	return {
		temporaryObject,
		createTemporaryObject,
		updateTemporaryObject,
		deleteTemporaryObject,
		getFinalTemporaryObject,
	};
}
