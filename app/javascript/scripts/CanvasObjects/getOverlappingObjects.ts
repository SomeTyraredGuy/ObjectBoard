import { CanvasObject, CanvasObjectType, Point } from "../../Types/CanvasObjects";
import { isTooSmallDrag } from "../canvasUtils";

function onSegment(p: Point, q: Point, r: Point) {
	if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
		return true;

	return false;
}

function orientation(p: Point, q: Point, r: Point) {
	const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

	if (val == 0) return 0;

	return val > 0 ? 1 : 2;
}

function linesIntersect(A1: Point, B1: Point, A2: Point, B2: Point): boolean {
	const o1 = orientation(A1, B1, A2);
	const o2 = orientation(A1, B1, B2);
	const o3 = orientation(A2, B2, A1);
	const o4 = orientation(A2, B2, B1);

	if (o1 != o2 && o3 != o4) return true;

	if (o1 == 0 && onSegment(A1, A2, B1)) return true;

	if (o2 == 0 && onSegment(A1, B2, B1)) return true;

	if (o3 == 0 && onSegment(A2, A1, B2)) return true;

	if (o4 == 0 && onSegment(A2, B1, B2)) return true;

	return false;
}

export default function getOverlappingObjects(objects: CanvasObject[], point1: Point, point2: Point): CanvasObject[] {
	const overlappingObjects: CanvasObject[] = [];
	let leftX1: number, rightX1: number, topY1: number, bottomY1: number;
	let leftX2: number, rightX2: number, topY2: number, bottomY2: number;

	if (point1.x > point2.x) {
		leftX1 = point2.x;
		rightX1 = point1.x;
	} else {
		leftX1 = point1.x;
		rightX1 = point2.x;
	}
	if (point1.y > point2.y) {
		topY1 = point2.y;
		bottomY1 = point1.y;
	} else {
		topY1 = point1.y;
		bottomY1 = point2.y;
	}

	objects.forEach((object) => {
		switch (object.type) {
			case CanvasObjectType.Rectangle:
				leftX2 = object.x;
				rightX2 = object.x + object.width;
				topY2 = object.y;
				bottomY2 = object.y + object.height;
				break;

			case CanvasObjectType.Ellipse:
				leftX2 = object.x - object.radiusX;
				rightX2 = object.x + object.radiusX;
				topY2 = object.y - object.radiusY;
				bottomY2 = object.y + object.radiusY;
				break;

			case CanvasObjectType.Text:
				leftX2 = object.x;
				rightX2 = object.x + object.text.length * 10;
				topY2 = object.y;
				bottomY2 = object.y + 10;
				break;

			case CanvasObjectType.Line:
				for (let i = 0; i < object.points.length; i += 2) {
					const pointA = { x: object.points[i], y: object.points[i + 1] };
					const pointB = object.points[i + 3] ? { x: object.points[i + 2], y: object.points[i + 3] } : null;

					if (
						(object.points[i] > leftX1 && // point is inside area
							object.points[i] < rightX1 &&
							object.points[i + 1] > topY1 &&
							object.points[i + 1] < bottomY1) ||
						(pointB &&
							(linesIntersect(pointA, pointB, { x: leftX1, y: topY1 }, { x: rightX1, y: topY1 }) || // top
								linesIntersect(pointA, pointB, { x: leftX1, y: bottomY1 }, { x: rightX1, y: bottomY1 }) || // bottom
								linesIntersect(pointA, pointB, { x: leftX1, y: topY1 }, { x: leftX1, y: bottomY1 }) || // left
								linesIntersect(pointA, pointB, { x: rightX1, y: bottomY1 }, { x: rightX1, y: topY1 }))) // right
					) {
						overlappingObjects.push(object);
					}

					return;
				}
				break;

			default:
				return;
		}

		if (leftX1 < rightX2 && leftX2 < rightX1 && topY1 < bottomY2 && topY2 < bottomY1) {
			overlappingObjects.push(object);
		}
	});

	if (overlappingObjects.length > 0 && isTooSmallDrag(point1, point2))
		return [overlappingObjects[overlappingObjects.length - 1]];

	return overlappingObjects;
}
