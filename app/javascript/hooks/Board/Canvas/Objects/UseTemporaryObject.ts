import { useState } from "react";
import { CanvasObject, CanvasObjectType, Point } from "../../../../Types/CanvasObjects";
import getDirection from "../../../../scripts/CanvasObjects/getDirection";

function createNewObject(currentPoint: Point, startingProperties: CanvasObject): CanvasObject {
	if (startingProperties.type === CanvasObjectType.Text)
		return {
			...startingProperties,
			x: currentPoint.x,
			y: currentPoint.y,
			text: "Text",
		};

	return {
		locked: false,
		...startingProperties,
	};
}

export default function UseTemporaryObject({ canvasState }) {
	const [temporaryObject, setTemporaryObject] = useState<CanvasObject | null>(null);

	function createTemporaryObject(currentPoint: Point) {
		setTemporaryObject(createNewObject(currentPoint, canvasState.startingProperties));
	}

	function updateTemporaryObject(startingPoint: Point, currentPoint: Point) {
		if (!temporaryObject) return;
		const { xRight, yBottom } = getDirection(startingPoint, currentPoint);

		switch (temporaryObject.type) {
			case CanvasObjectType.Rectangle: {
				const width = xRight ? currentPoint.x - startingPoint.x : startingPoint.x - currentPoint.x;
				const height = yBottom ? startingPoint.y - currentPoint.y : currentPoint.y - startingPoint.y;

				setTemporaryObject({
					...temporaryObject,
					x: xRight ? startingPoint.x : currentPoint.x,
					y: yBottom ? currentPoint.y : startingPoint.y,
					width: width,
					height: height,
				});
				break;
			}

			case CanvasObjectType.Ellipse: {
				const center: Point = {
					x: (currentPoint.x + startingPoint.x) / 2,
					y: (currentPoint.y + startingPoint.y) / 2,
				};
				const radiusX = xRight ? currentPoint.x - center.x : center.x - currentPoint.x;
				const radiusY = yBottom ? center.y - currentPoint.y : currentPoint.y - center.y;

				setTemporaryObject({
					...temporaryObject,
					x: center.x,
					y: center.y,
					radiusX: radiusX,
					radiusY: radiusY,
				});
				break;
			}

			case CanvasObjectType.Text:
				setTemporaryObject({
					...temporaryObject,
					x: currentPoint.x,
					y: currentPoint.y,
				});
				break;

			case CanvasObjectType.Line: {
				const lineTo: Point = { x: startingPoint.x, y: startingPoint.y };

				setTemporaryObject({
					...temporaryObject,
					points: [currentPoint.x, currentPoint.y, lineTo.x, lineTo.y],
				});
				break;
			}
		}
	}

	function deleteTemporaryObject() {
		setTemporaryObject(null);
	}

	return {
		temporaryObject,
		createTemporaryObject,
		updateTemporaryObject,
		deleteTemporaryObject,
	};
}
