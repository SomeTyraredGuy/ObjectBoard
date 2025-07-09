import { CanvasState, CanvasMode } from "../../Types/Canvas";
import { CanvasObject, CanvasObjectType, Point, XYWH } from "../../Types/CanvasObjects";

export function getXYWHfromArray(objects: CanvasObject[]): XYWH | null {
	if (objects.length === 0) return null;

	let minX = Number.MAX_VALUE;
	let minY = Number.MAX_VALUE;
	let maxX = -Number.MAX_VALUE;
	let maxY = -Number.MAX_VALUE;

	objects.forEach((object) => {
		if (!object) return;

		switch (object.type) {
			case CanvasObjectType.Rectangle:
			case CanvasObjectType.Text:
				minX = Math.min(minX, object.x);
				minY = Math.min(minY, object.y);
				maxX = Math.max(maxX, object.x + object.width);
				maxY = Math.max(maxY, object.y + object.height);
				break;

			case CanvasObjectType.Ellipse:
				minX = Math.min(minX, object.x - object.radiusX);
				minY = Math.min(minY, object.y - object.radiusY);
				maxX = Math.max(maxX, object.x + object.radiusX);
				maxY = Math.max(maxY, object.y + object.radiusY);
				break;

			case CanvasObjectType.Line:
				for (let i = 0; i < object.points.length; i += 2) {
					const pointX = object.points[i];
					const pointY = object.points[i + 1];
					minX = Math.min(minX, pointX);
					minY = Math.min(minY, pointY);
					maxX = Math.max(maxX, pointX);
					maxY = Math.max(maxY, pointY);
				}
				break;

			default:
				break;
		}
	});

	const width = maxX - minX;
	const height = maxY - minY;

	return {
		x: minX,
		y: minY,
		width: width,
		height: height,
	};
}

export function getXYWH(canvasState: CanvasState, current?: Point): XYWH | null {
	switch (canvasState.mode) {
		case CanvasMode.Selected:
			if (canvasState.objects.length === 0) return null;

			return getXYWHfromArray(canvasState.objects);

		case CanvasMode.SelectionNet:
			if (!current || !canvasState.origin) return null;
			return {
				x: canvasState.origin.x,
				y: canvasState.origin.y,
				width: current.x - canvasState.origin.x,
				height: current.y - canvasState.origin.y,
			};

		default:
			return null;
	}
}
