import { CanvasState, CanvasMode } from "../../Types/Canvas";
import { CanvasObject, CanvasObjectType, XYWH } from "../../Types/CanvasObjects";

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

			case CanvasObjectType.Text:
				minX = Math.min(minX, object.x);
				minY = Math.min(minY, object.y);
				// TODO: додати правильну обробку розміру тексту
				maxX = Math.max(maxX, object.x + object.text.length * 10);
				maxY = Math.max(maxY, object.y + 10);
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

export function getXYWH(canvasState: CanvasState, currentXYWH: XYWH | null): XYWH | null {
	switch (canvasState.mode) {
		case CanvasMode.Selected:
			if (canvasState.objects.length === 0) return null;

			if (canvasState.movedBy && currentXYWH) {
				const newXYWH = {
					x: currentXYWH.x + canvasState.movedBy.x,
					y: currentXYWH.y + canvasState.movedBy.y,
					width: currentXYWH.width,
					height: currentXYWH.height,
				};
				canvasState.movedBy = undefined;
				return newXYWH;
			}

			return getXYWHfromArray(canvasState.objects);

		case CanvasMode.SelectionNet:
			return {
				x: canvasState.origin.x,
				y: canvasState.origin.y,
				width: canvasState.current.x - canvasState.origin.x,
				height: canvasState.current.y - canvasState.origin.y,
			};

		default:
			return null;
	}
}
